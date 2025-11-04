// const { Server } = require("socket.io");

// // Start Socket.IO server on port 5000
// const io = new Server(5000, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   }
// });

// console.log("[Node] 🚀 Socket.IO server running on http://localhost:5000");

// io.on("connection", (socket) => {
//   console.log("[Node] ✅ Client connected");

//   // Receive code from VS Code extension
//   socket.on("message_from_node", (data) => {
//     console.log("[Node] Code received, sending to Python...");
//     io.emit("message_from_node", data); // forward to Python
//   });

//   // Receive AI results from Python
//   socket.on("ai_result", (result) => {
//     console.log("[Node] AI result received, sending to VS Code...");
//     io.emit("ai_result", result); // forward to VS Code
//   });

//   socket.on("disconnect", () => {
//     console.log("[Node] ❌ Client disconnected");
//   });
// });

// BACKEND/server.js
const { Server } = require("socket.io");
const io = new Server(5000, {
  cors: { origin: "*" },
});

console.log("🚀 Socket.IO Server is running on http://localhost:5000");

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  // Forward messages from VSCode (Node extension)
  socket.on("message_from_node", (data) => {
    console.log("📩 Received from VSCode:", data.code?.slice(0, 50));
    io.emit("message_from_node", data); // forward to Python
  });

  // Forward AI results from Python to VSCode
  socket.on("ai_result", (result) => {
    console.log("📤 Forwarding AI result to VSCode");
    io.emit("ai_result", result);
  });

  socket.on("disconnect", () => console.log("❌ Client disconnected"));
});
