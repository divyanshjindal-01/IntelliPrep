const vscode = require("vscode");
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const output = vscode.window.createOutputChannel("DebugBuddy");

  // 1) Start Socket.IO server ONCE
  const io = new Server(5000, { cors: { origin: "*" } });

  // Track Python process & socket state
  let pyProcess = null;
  let isConnected = false;
  let currentSocket = null;

  // 2) Handle a single connection lifecycle
  io.on("connection", (socket) => {
    currentSocket = socket;
    isConnected = true;
    output.appendLine("[Node] ✅ Python connected");

    socket.on("ai_analyze", (msg) => {
      output.appendLine("🧠 AI Response: " + msg);
      output.show();
    });

    socket.on("fixed_code_response", (msg) => {
      output.appendLine("✅ Fixed Code: " + msg);
      output.show();
    });

    socket.on("disconnect", () => {
      output.appendLine("[Node] ❌ Python disconnected");
      isConnected = false;
      currentSocket = null;
      // try to restart python if it died
      setTimeout(() => startPythonBackend(), 1000);
    });
  });

  // 3) Spawn Python backend (idempotent)
  function startPythonBackend() {
    if (pyProcess && !pyProcess.killed) return; // already running

    const pyPath = path.join(__dirname, "ai.py");
    output.appendLine(`[Node] ▶️ Starting Python: ${pyPath}`);

    pyProcess = spawn("python", [pyPath], {
      cwd: __dirname,
      env: { ...process.env, PYTHONIOENCODING: "utf-8" }, 
    });

    pyProcess.stdout.on("data", (data) => {
      output.appendLine("[Python] " + data.toString().trim());
    });

    pyProcess.stderr.on("data", (err) => {
      output.appendLine("⚠️ Python Error: " + err.toString().trim());
      output.show();
    });

    pyProcess.on("exit", (code, signal) => {
      output.appendLine(`[Node] Python exited code=${code} signal=${signal ?? ""}`);
      isConnected = false;
      currentSocket = null;
      pyProcess = null;
      // attempt auto-restart
      setTimeout(() => startPythonBackend(), 1500);
    });
  }

  // Start backend once on activation
  startPythonBackend();

  // 4) Commands
  const analyzeCmd = vscode.commands.registerCommand(
    "divyanshudebug-buddy.checkForError",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("Please open a file first.");
        return;
      }
      const text = editor.document.getText();
      if (!isConnected || !currentSocket) {
        vscode.window.showWarningMessage("⏳ Python not connected yet. Try again in a moment.");
        return;
      }
      currentSocket.emit("message_from_node", text);
      vscode.window.showInformationMessage("📤 Code sent to AI for analysis.");
    }
  );

  const fixCmd = vscode.commands.registerCommand(
    "divyanshudebug-buddy.fixCode",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("Please open a file first.");
        return;
      }
      const text = editor.document.getText();
      if (!isConnected || !currentSocket) {
        vscode.window.showWarningMessage("⏳ Python not connected yet. Try again in a moment.");
        return;
      }
      currentSocket.emit("fix_code_request", text);
      vscode.window.showInformationMessage("📤 Code sent to AI for fixing.");
    }
  );

  context.subscriptions.push(analyzeCmd, fixCmd, { dispose: () => io.close() });
}

function deactivate() {}

module.exports = { activate, deactivate };  