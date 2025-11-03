const { Server } = require("socket.io");

// Start Socket.IO server on port 5000
const io = new Server(5000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log("[Node] 🚀 Socket.IO server running on http://localhost:5000");

io.on("connection", (socket) => {
  console.log("[Node] ✅ Client connected");

  // Receive code from VS Code extension
  socket.on("message_from_node", (data) => {
    console.log("[Node] Code received, sending to Python...");
    io.emit("message_from_node", data); // forward to Python
  });

  // Receive AI results from Python
  socket.on("ai_result", (result) => {
    console.log("[Node] AI result received, sending to VS Code...");
    io.emit("ai_result", result); // forward to VS Code
  });

  socket.on("disconnect", () => {
    console.log("[Node] ❌ Client disconnected");
  });
});
