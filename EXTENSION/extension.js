const vscode = require("vscode");
const { io } = require("socket.io-client");
const { db } = require("./firebaseAdmin"); // ✅ Import Firestore
const { v4: uuidv4 } = require("uuid"); // ⬅️ New: Import for unique ID

let socket;
let panel;
let currentAuthSession; // ⬅️ New: Store the active session

/**
 * Saves or updates a user's basic profile in Firestore.
 * This is called immediately after a successful login.
 * @param {vscode.AuthenticationSession} session The active VS Code authentication session.
 */
async function saveUserToDatabase(session) {
    const userRef = db.collection("users").doc(session.account.id);

    try {
        await userRef.set({
            // Use GitHub ID as the unique document ID
            githubId: session.account.id, 
            username: session.account.label,
            lastLogin: new Date().toISOString(),
        }, { merge: true }); // Use merge: true to update fields without overwriting the whole document.
        console.log(`[VSCode] ✅ User ${session.account.label} saved/updated in Firestore.`);
    } catch (error) {
        console.error("[VSCode] ❌ Failed to save user to Firestore:", error);
        // vscode.window.showErrorMessage("Failed to save user data to database.");
    }
}

function activate(context) {
    // Connect to Python backend
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
        console.log("[VSCode] Connected to backend");
    });
    
    // --- New: Login Command ---
    let loginCommand = vscode.commands.registerCommand(
        "divyanshudebug-buddy.login",
        async () => {
            try {
                // Use the built-in GitHub authentication provider
                // Scopes: 'read:user' is typically required to get basic user info
                const session = await vscode.authentication.getSession("github", ["read:user"], {
                    createIfNone: true,
                });

                currentAuthSession = session;
                
                // 🚀 NEW: Save user data to Firebase on successful login
                await saveUserToDatabase(session); 

                vscode.window.showInformationMessage(`✅ Logged in as ${session.account.label} (GitHub)!`);

            } catch (error) {
                vscode.window.showErrorMessage(`❌ Login failed: ${error.message}`);
                currentAuthSession = null;
            }
        }
    );

    // --- New: Logout Command ---
    let logoutCommand = vscode.commands.registerCommand(
        "divyanshudebug-buddy.logout",
        () => {
            // Clear the locally stored session
            currentAuthSession = null;
            vscode.window.showInformationMessage("👋 Logged out of Debug Buddy.");
        }
    );
    // -------------------------

    // Register single command: Analyze & Fix
    let analyzeAndFix = vscode.commands.registerCommand(
        "divyanshudebug-buddy.analyzeAndFix",
        function () {
            if (!currentAuthSession) { // ⬅️ Check for login status
                vscode.window.showWarningMessage("🔒 Please log in with Debug Buddy first.");
                return;
            }

            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const code = editor.document.getText();
                
                // ⬅️ Send token and code to Python
                socket.emit("message_from_node", {
                    code: code,
                    githubToken: currentAuthSession.accessToken, // Pass the token!
                    userId: currentAuthSession.account.id // Pass the GitHub ID
                }); 
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
                // ⬅️ New: Store the authenticated user's ID
                userId: parsed.userId || currentAuthSession?.account?.id || "anonymous", 
                username: currentAuthSession?.account?.label || "Anonymous",
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
                
                // Handle panel being closed
                panel.onDidDispose(() => {
                    panel = undefined;
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

    context.subscriptions.push(analyzeAndFix, loginCommand, logoutCommand); // ⬅️ Register new commands
}

function deactivate() {
    if (socket) socket.disconnect();
}

function getWebviewContent(parsed) {
    const fixAvailable = parsed.fix ? true : false;
    const loggedInUser = currentAuthSession ? currentAuthSession.account.label : "Not Logged In";

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; padding: 15px; line-height: 1.6; }
        h2 { color: #4CAF50; }
        .user-info { margin-bottom: 20px; padding: 10px; background: #333; border-radius: 5px; color: #fff; font-size: 0.9em;}
        .card { background: #1e1e1e; padding: 12px; border-radius: 8px; margin-bottom: 15px; color: #dcdcdc; }
        .label { font-weight: bold; color: #4CAF50; }
        pre { background: #252526; padding: 10px; border-radius: 5px; overflow-x: auto; }
        button { margin-top: 10px; margin-right: 10px; padding: 8px 12px; border: none; border-radius: 5px; cursor: pointer; }
        .apply { background-color: #4CAF50; color: white; }
        .copy { background-color: #2196F3; color: white; }
      </style>
    </head>
    <body>
      <div class="user-info">Logged in as: <strong>${loggedInUser}</strong></div>
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