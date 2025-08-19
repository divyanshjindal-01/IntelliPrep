const vscode = require("vscode");
const { exec } = require("child_process");
const fs = require("fs");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const outputChannel = vscode.window.createOutputChannel("DebugBuddy");

  let disposable = vscode.commands.registerCommand(
    "divyanshudebug-buddy.checkForError",
    () => checkForError(outputChannel)
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
module.exports = { deactivate };

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> check for error >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
function checkForError(outputChannel) {
  const editor = vscode.window.activeTextEditor;

  // Get editor text or fallback
  let text = "No code provided";
  if (editor) {
    text = editor.document.getText();
  } else {
    vscode.window.showInformationMessage("Editor empty. Using default text.");
  }

  // ✅ Always create/update data.json
  try {
    fs.writeFileSync("data.json", JSON.stringify({ value: text }, null, 2));
  } catch (err) {
    vscode.window.showErrorMessage("Failed to create data.json: " + err.message);
    return;
  }

  // ✅ Run Python with correct command for Windows
  exec("python ai.py", (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(`Python error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
    }

    outputChannel.show(true);
    outputChannel.appendLine(stdout);
  });
}
