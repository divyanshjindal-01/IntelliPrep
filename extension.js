const vscode = require("vscode");
const { io } = require("socket.io-client");
const { db } = require("./firebaseAdmin"); // ✅ Import Firestore

let socket;
let panel;

function activate(context) {
  // Connect to Python backend
  socket = io("http://localhost:5000");

  socket.on("connect", () => {
    console.log("[VSCode] Connected to backend");
  });

  // Register single command: Analyze & Fix
  let analyzeAndFix = vscode.commands.registerCommand(
    "divyanshudebug-buddy.analyzeAndFix",
    function () {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const code = editor.document.getText();
        socket.emit("message_from_node", code); // send code to Python
        vscode.window.showInformationMessage("📤 Sending code to AI...");
      }
    }
  );

  // Listen for AI JSON response
  socket.on("ai_result", async (result) => {
    try {
      const parsed = typeof result === "string" ? JSON.parse(result) : result;

      // ✅ Save AI result to Firebase Firestore
      await db.collection("debugBuddyResults").add({
        analyze: parsed.analyze || "N/A",
        errorType: parsed.type_of_error || "N/A",
        language: parsed.programming_language_used || "N/A",
        fix: parsed.fix || "N/A",
        timestamp: new Date().toISOString(),
      });

      console.log("✅ Saved AI result to Firebase");

      // Create or reveal side panel
      if (!panel) {
        panel = vscode.window.createWebviewPanel(
          "debugBuddyResults",
          "Debug Buddy Results",
          vscode.ViewColumn.Beside,
          { enableScripts: true }
        );

        // Listen for button clicks from Webview
        panel.webview.onDidReceiveMessage((message) => {
          if (message.command === "applyFix" && message.fix) {
            applyFix(message.fix);
          } else if (message.command === "copyFix" && message.fix) {
            vscode.env.clipboard.writeText(message.fix);
            vscode.window.showInformationMessage("📋 Fix copied to clipboard!");
          }
        });
      } else {
        panel.reveal(vscode.ViewColumn.Beside);
      }

      // Build HTML content for panel
      panel.webview.html = getWebviewContent(parsed);
    } catch (err) {
      vscode.window.showErrorMessage("❌ AI response parse error: " + err.message);
    }
  });

  context.subscriptions.push(analyzeAndFix);
}

function deactivate() {
  if (socket) socket.disconnect();
}

function getWebviewContent(parsed) {
  const fixAvailable = parsed.fix ? true : false;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; padding: 15px; line-height: 1.6; }
      h2 { color: #4CAF50; }
      .card { background: #1e1e1e; padding: 12px; border-radius: 8px; margin-bottom: 15px; color: #dcdcdc; }
      .label { font-weight: bold; color: #4CAF50; }
      pre { background: #252526; padding: 10px; border-radius: 5px; overflow-x: auto; }
      button { margin-top: 10px; margin-right: 10px; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
      .apply { background-color: #4CAF50; color: white; }
      .copy { background-color: #2196F3; color: white; }
    </style>
  </head>
  <body>
    <h2>Debug Buddy Analysis</h2>
    <div class="card"><span class="label">Analysis:</span><br>${parsed.analyze || "N/A"}</div>
    <div class="card"><span class="label">Error Type:</span> ${parsed.type_of_error || "N/A"}</div>
    <div class="card"><span class="label">Language:</span> ${parsed.programming_language_used || "N/A"}</div>
    <div class="card">
      <span class="label">Fixed Code:</span>
      <pre>${parsed.fix ? escapeHtml(parsed.fix) : "No fix available"}</pre>
      ${
        fixAvailable
          ? `<button class="apply" onclick="applyFix()">Apply Fix</button>
             <button class="copy" onclick="copyFix()">Copy Fix</button>`
          : ""
      }
    </div>

    <script>
      const vscode = acquireVsCodeApi();

      function applyFix() {
        vscode.postMessage({ command: "applyFix", fix: \`${escapeJs(parsed.fix || "")}\` });
      }

      function copyFix() {
        vscode.postMessage({ command: "copyFix", fix: \`${escapeJs(parsed.fix || "")}\` });
      }
    </script>
  </body>
  </html>
  `;
}

// Escape HTML for safe display
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Escape JS for embedding in <script>
function escapeJs(str) {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

// Function to apply fix into editor
function applyFix(newCode) {
  const editor = vscode.window.activeTextEditor;
  if (editor) {
    const edit = new vscode.WorkspaceEdit();
    const document = editor.document;
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);
    edit.replace(document.uri, fullRange, newCode);
    vscode.workspace.applyEdit(edit);
    vscode.window.showInformationMessage("✅ Fix applied successfully!");
  }
}

module.exports = {
  activate,
  deactivate,
};
