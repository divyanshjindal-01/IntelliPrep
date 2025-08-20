const vscode = require("vscode");
const { Server } = require("socket.io");
const { spawn } = require("child_process");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const outputChannel = vscode.window.createOutputChannel("DebugBuddy");

  // Start Socket.IO server once
  const io = new Server(5000, {
    cors: { origin: "*" }
  });

  let disposable = vscode.commands.registerCommand(
    "divyanshudebug-buddy.checkForError",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("Open a file first!");
        return;
      }

      const text = editor.document.getText();

      // Start Python process

      const path = require("path");

// ...

      const pyPath = path.join(__dirname, "ai.py");
      const pyProcess = spawn("python", [pyPath]);

      pyProcess.stdout.on("data", (data) => {
        outputChannel.appendLine(data.toString());
        outputChannel.show();
      });

      pyProcess.stderr.on("data", (err) => {
        outputChannel.appendLine("⚠️ Python Error: " + err.toString());
        outputChannel.show();
      });

      // When Python connects via socket
      io.on("connection", (socket) => {
        console.log("Python connected ✅");
        socket.emit("message_from_node", text);

        socket.on("ai_response", (msg) => {
          outputChannel.appendLine(" AI Response: " + msg);
          outputChannel.show();
        });
      });
    }
  );

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = { activate, deactivate };
