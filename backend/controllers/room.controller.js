// controllers/room.controller.js
import { Room } from "../models/room.model.js";
import crypto from "crypto";

export const createRoom = async (req, res) => {
  try {
    const { name, isPrivate } = req.body;
    const joinCode = isPrivate ? crypto.randomBytes(4).toString("hex") : null;

    const room = new Room({
      name,
      isPrivate,
      joinCode,
      admin: req.userId,
      users: [req.userId],
      currentTurnUser: req.userId,
    });

    await room.save();
    res.status(201).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const joinRoom = async (req, res) => {
  try {
    const { roomId, joinCode } = req.body;
    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    if (room.isPrivate && room.joinCode !== joinCode)
      return res.status(401).json({ success: false, message: "Invalid join code" });

    if (!room.users.includes(req.userId)) room.users.push(req.userId);

    await room.save();
    res.status(200).json({ success: true, room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    // ⬅️ UPDATED: Find rooms where the authenticated user (req.userId) is in the 'users' array
    const rooms = await Room.find({
      users: req.userId // Filters rooms where 'users' array contains req.userId
    })
    .populate("admin", "name") // Populate admin name for display
    .select("name isPrivate admin createdAt"); // Select only necessary fields

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching user's rooms:", error);
    res.status(500).json({ success: false, message: "Server error fetching user's rooms" });
  }
};


export const getRoomDetails = async (req, res) => {
  try {
    const { roomId } = req.params;
    
    // Find the room by ID and select only the 'name' field
    const room = await Room.findById(roomId).select("name");

    if (!room) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    // Respond with the room details (just the name)
    res.status(200).json({ success: true, room: { name: room.name } });
  } catch (error) {
    console.error("Error fetching room details:", error);
    // If the ID format is invalid (e.g., not a valid MongoDB ObjectId), a 500 error will occur here.
    res.status(500).json({ success: false, message: "Server error fetching room details" });
  }
};

export const getAllRoomsAdmin = (roomState) => async (req, res) => {
  try {
    // 1. Find ALL rooms from the database
    const roomsFromDB = await Room.find({})
      .populate("admin", "name")
      .select("name isPrivate admin createdAt users");

    // 2. Map over the database rooms to inject live user data
    const roomsWithLiveUsers = roomsFromDB.map(room => {
      const roomId = room._id.toString();
      
      let activeUsers = [];
      // Get live user data from the in-memory socket state
      if (roomState[roomId] && roomState[roomId].users) {
        const uniqueUsers = {};
        // Filter out duplicates based on userId (to handle multiple tabs from same user)
        Object.values(roomState[roomId].users).forEach(u => {
          if (!uniqueUsers[u.userId]) {
            uniqueUsers[u.userId] = { userId: u.userId, userName: u.userName || `Guest ${u.userId.substring(5, 10)}` };
          }
        });
        activeUsers = Object.values(uniqueUsers);
      }

      // Convert Mongoose object to plain object before adding new property
      const roomObject = room.toObject();
      roomObject.activeUsers = activeUsers; // ⬅️ Inject the live user list

      return roomObject;
    });

    res.status(200).json({ success: true, rooms: roomsWithLiveUsers });
  } catch (error) {
    console.error("Error fetching all admin rooms:", error);
    res.status(500).json({ success: false, message: "Server error fetching all rooms" });
  }
};