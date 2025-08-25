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

    socket.on("ai_response", (msg) => {
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




// const vscode = require("vscode");
// const { Server } = require("socket.io");
// const { spawn } = require("child_process");
// const path = require("path");

// /**
//  * @param {vscode.ExtensionContext} context
//  */
// function activate(context) {
//   const outputChannel = vscode.window.createOutputChannel("DebugBuddy");
//   var editor;
//   var text;

//     // Register command to analyze code (Check for errors)
//   let disposableCheckForError = vscode.commands.registerCommand("divyanshudebug-buddy.checkForError", () => {
//     editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showInformationMessage("Please open a file first.");
//       return;
//     }

//     text = editor.document.getText();

//     if (!isConnected) {
//       vscode.window.showInformationMessage("⏳ Python is not connected yet. Please wait a moment...");
//       return;
//     }

//     // Emit the code to the Python backend
//     io.emit("message_from_node", text);
//     vscode.window.showInformationMessage("📤 Code sent to AI for analysis.");
//   });

//   // Register command to fix code
//   let disposableFixCode = vscode.commands.registerCommand("divyanshudebug-buddy.fixCode", () => {
//     const editor = vscode.window.activeTextEditor;
//     if (!editor) {
//       vscode.window.showInformationMessage("Please open a file first.");
//       return;
//     }

//     const text = editor.document.getText();

//     if (!isConnected) {
//       vscode.window.showInformationMessage("⏳ Python is not connected yet. Please wait a moment...");
//       return;
//     }

//     // Emit the code to the Python backend for fixing
//     io.emit("fix_code_request", text);
//     vscode.window.showInformationMessage("📤 Code sent to AI for fixing...");
//   });

//   // Start Socket.IO server (only once)
//   const io = new Server(5000, {
//     cors: { origin: "*" },
//   });

//   let isConnected = false;

//   // Setup socket listener for AI response
//   io.on("connection", (socket) => {
//     console.log("✅ Python connected to Node server");
//     isConnected = true;
//     socket.emit("message_from_node", text);


//     socket.on("ai_response", (msg) => {
//       outputChannel.appendLine("🧠 AI Response: " + msg);
//       outputChannel.show();
//     });

//     socket.on("fixed_code_response", (msg) => {
//       // Handle the fixed code response from AI
//       outputChannel.appendLine("✅ Fixed Code: " + msg);
//       outputChannel.show();
//     });

//     socket.on("disconnect", () => {
//       console.log("❌ Python disconnected");
//       isConnected = false;
//       // Attempt to reconnect to Python
//       startPythonBackend();
//     });
//   });

//   // Function to start Python backend
//   function startPythonBackend() {
//     const pyPath = path.join(__dirname, "ai.py");
//     const pyProcess = spawn("python", [pyPath]);

//     pyProcess.stdout.on("data", (data) => {
//       outputChannel.appendLine("[Python] " + data.toString().trim());
//     });

//     pyProcess.stderr.on("data", (err) => {
//       outputChannel.appendLine("⚠️ Python Error: " + err.toString().trim());
//       outputChannel.show();
//     });

//       // When Python connects via socket
//       // io.on("", (socket) => {
//         console.log("Python connected ✅");
//         // socket.emit("message_from_node", text);

//   // Start Python backend once
//   startPythonBackend();



//   context.subscriptions.push(disposableCheckForError);
//   context.subscriptions.push(disposableFixCode);
// // })
// }
// }
// function deactivate() {}

// module.exports = {
//   activate,
//   deactivate,
// };
