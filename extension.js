const vscode = require("vscode");
const { Server } = require("socket.io");
const { spawn } = require("child_process");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const outputChannel = vscode.window.createOutputChannel("DebugBuddy");

  // Start Socket.IO server (only once)
  const io = new Server(5000, {
    cors: { origin: "*" },
  });

  let isConnected = false;

  // Setup socket listener for AI response
  io.on("connection", (socket) => {
    console.log("✅ Python connected to Node server");
    isConnected = true;

    socket.on("ai_response", (msg) => {
      outputChannel.appendLine("🧠 AI Response: " + msg);
      outputChannel.show();
    });

    socket.on("fixed_code_response", (msg) => {
      // Handle the fixed code response from AI
      outputChannel.appendLine("✅ Fixed Code: " + msg);
      outputChannel.show();
    });

    socket.on("disconnect", () => {
      console.log("❌ Python disconnected");
      isConnected = false;
      // Attempt to reconnect to Python
      startPythonBackend();
    });
  });

  // Function to start Python backend
  function startPythonBackend() {
    const pyPath = path.join(__dirname, "ai.py");
    const pyProcess = spawn("python", [pyPath]);

    pyProcess.stdout.on("data", (data) => {
      outputChannel.appendLine("[Python] " + data.toString().trim());
    });

    pyProcess.stderr.on("data", (err) => {
      outputChannel.appendLine("⚠️ Python Error: " + err.toString().trim());
      outputChannel.show();
    });

    pyProcess.on("exit", (code) => {
      outputChannel.appendLine(`❌ Python process exited with code ${code}`);
      isConnected = false;
      // Attempt to restart Python if it crashes
      setTimeout(startPythonBackend, 3000);
    });
  }

  // Start Python backend once
  startPythonBackend();

  // Register command to analyze code (Check for errors)
  let disposableCheckForError = vscode.commands.registerCommand("divyanshudebug-buddy.checkForError", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("Please open a file first.");
      return;
    }

    const text = editor.document.getText();

    if (!isConnected) {
      vscode.window.showInformationMessage("⏳ Python is not connected yet. Please wait a moment...");
      return;
    }

    // Emit the code to the Python backend
    io.emit("message_from_node", text);
    vscode.window.showInformationMessage("📤 Code sent to AI for analysis.");
  });

  // Register command to fix code
  let disposableFixCode = vscode.commands.registerCommand("divyanshudebug-buddy.fixCode", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage("Please open a file first.");
      return;
    }

    const text = editor.document.getText();

    if (!isConnected) {
      vscode.window.showInformationMessage("⏳ Python is not connected yet. Please wait a moment...");
      return;
    }

    // Emit the code to the Python backend for fixing
    io.emit("fix_code_request", text);
    vscode.window.showInformationMessage("📤 Code sent to AI for fixing...");
  });

  context.subscriptions.push(disposableCheckForError);
  context.subscriptions.push(disposableFixCode);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
