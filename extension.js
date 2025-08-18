const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const outputChannel = vscode.window.createOutputChannel("DebugBuddy");

  // Register the "findMistakes" command.
  const disposable = vscode.commands.registerCommand(
    'divyanshudebug-buddy.findMistakes',
    ()=>{findVar(outputChannel)}
  );

  // Register the "hello world" command.
  const helloworld = vscode.commands.registerCommand(
    'divyanshudebug-buddy.printHelloWorld',()=>printworld()
  );

  // check "error in code" command.
  const checkError = vscode.commands.registerCommand(
    'checkForError',()=>checkForError()
  )

  // Add to subscriptions so VS Code cleans it up when extension stops
  context.subscriptions.push(disposable,helloworld,outputChannel);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};


//  >>>>>>>>>>>>>>>>>>>>>>>>>> find var functions >>>>>>>>>>>>>>>>>>>>>>>>>>
function findVar (outputChannel){
    
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage('No active editor found.');
        return;
      }

      const text = editor.document.getText();
      outputChannel.appendLine("Checking current file for 'var'...");
      if (text.includes('var')) {
        vscode.window.showWarningMessage("Found 'var'. Consider using 'let' or 'const' instead.");
        outputChannel.appendLine("⚠️ Found 'var' keyword in file.");
      } else {
        vscode.window.showInformationMessage('No mistakes found!');
      }
}
//  >>>>>>>>>>>>>>>>>>>>>>>>>> print hello functions >>>>>>>>>>>>>>>>>>>>>>>>>>

function printworld(){
  vscode.window.showInformationMessage('hello,world!');
}

function checkForError(outputChannel){
  const editor = vscode.window.activeTextEditor;
  if(!editor){
    vscode.window.showInformationMessage("first write the code");
    return;
  }
  const text = editor.document.getText();
  let suggestion;
  outputChannel.appendLine(suggestion)
  // input = text;
  // output = suggestion;
}