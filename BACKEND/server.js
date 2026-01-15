// // BACKEND/server.js
// import { Server } from "socket.io";
// import { spawn } from "child_process";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const PORT = 5000;
// const io = new Server(PORT, { cors: { origin: "*" } });
// console.log(`🚀 Socket.IO Server running on http://localhost:${PORT}`);

// let pyProcess = null;

// // Spawn Python process function
// function startPython() {
//   const pyPath = path.join(__dirname, "../EXTENSION/ai.py");
//   console.log("🐍 Starting Python AI worker...");

//   pyProcess = spawn("python", [pyPath], {
//     cwd: path.join(__dirname, "../EXTENSION"),
//     stdio: ["pipe", "pipe", "pipe"],
//   });

//   // Handle Python stdout messages
//   pyProcess.stdout.on("data", (data) => {
//     const msg = data.toString().trim();
//     if (msg) console.log(`[PY]: ${msg}`);
//   });

//   // Handle Python stderr (errors)
//   pyProcess.stderr.on("data", (data) => {
//     console.error(`[PY-ERR]: ${data.toString()}`);
//   });

//   // Restart Python if it crashes
//   pyProcess.on("close", (code) => {
//     console.warn(`⚠️ Python process exited with code ${code}`);
//     pyProcess = null;
//     setTimeout(startPython, 3000); // auto-restart after 3s
//   });
// }

// // Start Python worker immediately
// startPython();

// // Handle Socket.IO connections
// io.on("connection", (socket) => {
//   console.log("✅ Client connected:", socket.id);

//   socket.on("message_from_node", (data) => {
//     console.log("📩 VSCode Request:", data.code?.slice(0, 60) || "<no code>");
//     io.emit("message_from_node", data); // forward to Python
//   });

//   socket.on("analyze:response", (result) => {
//     console.log("📤 Forwarding AI result to VSCode");
//     io.emit("analyze:response", result);
//   });

//   socket.on("disconnect", () => console.log("❌ Client disconnected:", socket.id));
// });

// // Clean exit handling
// process.on("SIGINT", () => {
//   console.log("🛑 Shutting down...");
//   if (pyProcess) pyProcess.kill("SIGINT");
//   io.close(() => {
//     console.log("✅ Server closed.");
//     process.exit(0);
//   });
// });











// 📁 backend/server.js

const { Server } = require("socket.io");
const io = new Server(5000, {
  cors: { origin: "*" },
});
const { spawn } = require("child_process");
const python = spawn("python", ["./EXTENSION/ai.py"], { detached: true, stdio: "ignore" });
python.unref();

console.log("🚀 Socket.IO Server is running on http://localhost:5000");

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // 🔹 Handle messages from VS Code extension
  socket.on("analyze:request", (data) => {
    console.log("📩 Received from VSCode:", data.code?.slice(0, 60));
    // Forward this to Python AI client(s)
    io.emit("analyze:request", data);
  });

  // 🔹 Handle AI results from Python
  socket.on("analyze:response", (result) => {
    console.log("📤 Forwarding AI result to VSCode");
    io.emit("analyze:response", result);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
