// routes/room.route.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createRoom, joinRoom, getRooms, getRoomDetails, getAllRoomsAdmin } from "../controllers/room.controller.js";

const router = express.Router();
const roomState = {};
router.post("/create", verifyToken, createRoom);
router.post("/join", verifyToken, joinRoom);
router.get("/", verifyToken, getRooms);
router.get("/:roomId", verifyToken, getRoomDetails);
router.get("/admin/rooms", getAllRoomsAdmin(roomState));
export default router;
