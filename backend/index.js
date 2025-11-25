import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import roomRoutes from "./routes/room.route.js";
import { Room } from "./models/room.model.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { OpenAI } from "openai";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

const openai = new OpenAI();

// ⛑ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// 🔌 Create HTTP server for socket.io
const server = http.createServer(app);

// 🔥 Initialize Socket.io
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

// 🔥 Collaboration State & Maps
const roomState = {};
const socketToRoomMap = {};

/**
 * Helper function to broadcast the current list of UNIQUE users in a room.
 * Now returns objects with { userId, userName } instead of just userId.
 * @param {string} roomId
 */
function broadcastActiveUsers(roomId) {
  if (roomState[roomId] && roomState[roomId].users) {
    const uniqueUsers = {};
    
    // Iterate over all connected sockets in the room
    Object.values(roomState[roomId].users).forEach(u => {
      // Only keep the first instance of a unique userId (in case of multiple tabs)
      if (!uniqueUsers[u.userId]) {
        uniqueUsers[u.userId] = { userId: u.userId, userName: u.userName || u.userId }; // Ensure it falls back to ID if name is missing
      }
    });
    
    // Convert map back to an array of unique user objects
    const activeUserList = Object.values(uniqueUsers); 
    
    io.to(roomId).emit("activeUsersUpdated", activeUserList); // ⬅️ Sends list of {userId, userName} objects
  }
}

// 🌐 Socket.io Events
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
/////////////////////////////////
  socket.on("joinRoom", async ({ roomId, userId , userName}) => {
  socket.join(roomId);
  console.log(`👥 User ${userName} (${userId}) joined room ${roomId}`);

  socketToRoomMap[socket.id] = { roomId, userId,userName };

  // Add user to roomState
  if (!roomState[roomId]) roomState[roomId] = { currentEditorId: null, users: {}, code: "// loading..." };
  roomState[roomId].users[socket.id] = { userId, socketId: socket.id, userName };

  // Fetch code from DB
  try {
    const room = await Room.findById(roomId);
    if (room) {
      roomState[roomId].code = room.codeContent || "// Start coding here...";
    }
  } catch (err) {
    console.error("DB fetch error:", err.message);
  }

  // Send current code & turn info
  io.to(socket.id).emit("codeUpdated", roomState[roomId].code);
  io.to(socket.id).emit("turnGranted", roomState[roomId].currentEditorId);

  // Broadcast active users
  broadcastActiveUsers(roomId);
});

// --- DEPRECATED FOR TURN-BASED MODE: Removed socket.on("updateCode", ...) ---

  /**
  * Handles a user requesting the editing token.
  * Only grants turn if no one currently holds it (currentEditorId is null).
  */
  socket.on("requestTurn", ({ roomId, userId }) => {
    if (!roomState[roomId] || roomState[roomId].currentEditorId) {
      // Room doesn't exist or someone already has the turn. Do nothing.
      return;
    }
    
    // Grant the turn
    roomState[roomId].currentEditorId = userId;

    // Broadcast the new turn holder to everyone
    io.to(roomId).emit("turnGranted", roomState[roomId].currentEditorId);
  });
  
  /**
  * Handles a user finishing their editing turn.
  * This is the ONLY time code changes are broadcast.
  */
// index.js (Backend)

socket.on("finishTurn", async ({ roomId, userId, finalCode }) => {
  console.log("Received finishTurn:", { roomId, userId, finalCode: finalCode.substring(0, 50) + '...' });
  
  if (!roomState[roomId] || roomState[roomId].currentEditorId !== userId) {
    console.warn(`Attempted finishTurn by non-editor ${userId} in room ${roomId}`);
    return;
  }

  // 1️⃣ Update DB atomically (Code save + Turn release)
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { 
        codeContent: finalCode,
        currentTurnUser: null // CRUCIAL: Clear the turn in the DB
      },
      { new: true } // Returns the updated room document
    );
    
    if (!updatedRoom) {
      console.error("Room not found during finishTurn update:", roomId);
      return;
    }
    
    console.log("✅ Code and Turn successfully saved/cleared in DB.");
    
  } catch (err) {
    console.error("❌ Failed to save code in DB:", err.message);
    return; // Stop execution if DB save failed
  }

  // 2️⃣ Update in-memory state
  roomState[roomId].code = finalCode;
  roomState[roomId].currentEditorId = null;

  // 3️⃣ Broadcast updated code and free turn to all clients
  io.to(roomId).emit("codeUpdated", finalCode);
  io.to(roomId).emit("turnGranted", null);
  console.log("📢 Broadcasted new code and free turn.");
});


  socket.on("disconnect", () => {
    const { roomId, userId, userName } = socketToRoomMap[socket.id] || {};

    if (roomId && roomState[roomId]) {
      // Remove user socket instance from room state
      delete roomState[roomId].users[socket.id];
      delete socketToRoomMap[socket.id];

      // Re-broadcast updated user list
      broadcastActiveUsers(roomId);

      // Check if the disconnected user was the editor and if they truly left
      const remainingUsers = Object.values(roomState[roomId].users);
      const userStillInRoom = remainingUsers.some(u => u.userId === userId);

      if (roomState[roomId].currentEditorId === userId && !userStillInRoom) {
        // If the editor disconnected and has no other active connections, free the turn
        roomState[roomId].currentEditorId = null;
        io.to(roomId).emit("turnGranted", null); // Broadcast turn is free
      } else if (remainingUsers.length === 0) {
        // Handle empty room scenario cleanly
        roomState[roomId].currentEditorId = null;
      }
    }
  });
});
// 🛣 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes); 

// 🚀 OpenAI Code Generator API (unchanged)
app.post("/generate-code", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Enhanced system prompt for full styling of navbar, footer, buttons, inputs, etc.
    const messages = [
      {
        role: "system",
        content: `
You are a world-class front-end developer and UI/UX designer.

- Generate ONLY a single React component inside an App.js file.
- You can use TailwindCSS or inline style objects.
- Include all styles inside a single <style> tag at the top of the JSX file or when asked to use tailwindcss you can use it.
- The component must be modern, visually striking, fully responsive, interactive, and pixel-perfect.
- Use Framer Motion for animations (fade, slide, scale, staggered children, hover and focus effects).
- All elements must have realistic spacing, clean typography, gradients, shadows, rounded corners, and smooth transitions.

MANDATORY STYLING:
1. Buttons: gradient, hover/active effects, subtle scale, shadow, rounded corners, smooth transitions.
2. Inputs/Textareas: styled focus & hover, soft borders, padding, shadows, rounded corners, smooth transitions.
3. Links: hover & focus effects, smooth color/underline transitions.
4. Navbar: sticky/fixed, fully responsive, styled links, logo placement, hover/active effects, smooth background transitions.
5. Footer: fully responsive, visually balanced, styled social icons, links, copyright, background gradients or subtle textures, hover/focus effects.

- Sections like hero, about, services, portfolio, contact, or any described in the user prompt must be fully styled, responsive, animated, and visually modern.
- Do not assume a fixed layout; adapt automatically to the content in the user prompt.
- The UI must look professional, modern, elegant, and fully polished no matter the content.
- Output ONLY JSX code with a single <style> tag; do not include explanations, comments, markdown, or text outside the JSX.
- Do NOT use external CSS files.
        `,
      },
      {
        role: "user",
        content: prompt,
      },
    ];

    // Call OpenAI Chat API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // you can change to gpt-4o or gpt-4 if needed
      messages,
    });

    const rawContent = completion.choices[0].message.content;

    // Extract JSX code from markdown if returned
    const codeRegex = /```(?:jsx|javascript|js)?\s*([\s\S]*?)\s*```/;
    const match = rawContent.match(codeRegex);
    const cleanCode = match && match[1] ? match[1].trim() : rawContent.trim();

    res.json({ code: cleanCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

// 📦 Serve Frontend in Production (unchanged)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// 🚀 Start server (unchanged)
server.listen(PORT, async () => {
    await connectDB();
    console.log(`🚀 Server & Socket running at http://localhost:${PORT}`);
});