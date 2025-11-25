// models/room.model.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPrivate: { type: Boolean, default: false },
    joinCode: { type: String }, // for private rooms only
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    currentTurnUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    codeContent: { type: String, default: "// Start coding here..." },
  },
  { timestamps: true }
);

export const Room = mongoose.model("Room", roomSchema);
