import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import NavBar from "../components/NavBar";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/room"
    : "https://codesense-7sfi.onrender.com/api/room";

const RoomPage = () => {
  const { user } = useAuthStore();
  const [userName, setUserName] = useState(user.name);
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const saveNameAndNavigate = (path) => {
    localStorage.setItem("userDisplayName", userName.trim());
    navigate(path);
  };

  const createRoom = async () => {
    const res = await axios.post(
      `${API_BASE_URL}/create`,
      { name: roomName, isPrivate: false },
      { withCredentials: true }
    );
    saveNameAndNavigate(`/editor/${res.data.room._id}`);
  };

  const joinExistingRoom = async () => {
    await axios.post(
      `${API_BASE_URL}/join`,
      { roomId, joinCode },
      { withCredentials: true }
    );
    saveNameAndNavigate(`/editor/${roomId}`);
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen relative flex flex-col items-center justify-center px-4 py-12 bg-black overflow-hidden">
        {/* Background neon particles - Changed to deep blue/violet/cyan */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-violet-900 to-cyan-900 opacity-30 animate-[pulse_20s_infinite]"></div>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-[float_8s_infinite] opacity-50" style={{ top: "10%", left: "15%" }} />
          <div className="absolute w-2 h-2 bg-violet-400 rounded-full animate-[float_10s_infinite] opacity-50" style={{ top: "70%", left: "80%" }} />
          <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-[float_12s_infinite] opacity-50" style={{ top: "40%", left: "50%" }} />
        </div>

        {/* Title Gradient - Changed to blue/violet/cyan */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-500 to-cyan-400 drop-shadow-lg text-center mb-12 animate-pulse">
          Collaborative AI Coding Rooms
        </h1>

        {/* CREATE ROOM CARD */}
        {/* Border and Shadow - Changed to cyan-400/blue-400 */}
        <div className="relative w-full max-w-md p-8 rounded-3xl bg-black/20 backdrop-blur-lg border border-cyan-400 shadow-2xl hover:shadow-[0_20px_40px_rgba(0,180,255,0.5)] transition-all duration-500 mb-10 animate-float">
          {/* Inner Blur - Changed to blue/violet/cyan */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500 rounded-3xl blur opacity-60 animate-gradient-x"></div>
          <div className="relative space-y-6 z-10">
            {/* Title Color - Changed to cyan-400 */}
            <h2 className="text-2xl font-bold text-cyan-400 text-center">Create a Room</h2>

            <div className="space-y-4">
              <div className="flex flex-col relative">
                <label className="text-sm text-gray-300 mb-1">Your Display Name</label>
                <input
                  // Focus Ring - Changed to cyan-400
                  className="p-3 rounded-xl bg-black/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition duration-200 relative z-10"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={20}
                  disabled
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-sm text-gray-300 mb-1">Room Name</label>
                <input
                  // Focus Ring - Changed to cyan-400
                  className="p-3 rounded-xl bg-black/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 transition duration-200 relative z-10"
                  placeholder="Enter Room Name"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <button
                // Button Gradient and Hover Shadow - Changed to blue/violet/cyan
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 font-semibold text-white shadow-lg hover:shadow-[0_0_20px_rgba(0,255,255,0.7)] hover:scale-[1.05] transition-all duration-300 disabled:opacity-50"
                onClick={createRoom}
                disabled={!userName.trim() || !roomName.trim()}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>

        {/* JOIN ROOM CARD */}
        {/* Border and Shadow - Changed to amber-400/red-400 (for distinction) */}
        <div className="relative w-full max-w-md p-8 rounded-3xl bg-black/20 backdrop-blur-lg border border-amber-400 shadow-2xl hover:shadow-[0_20px_40px_rgba(255,160,0,0.5)] transition-all duration-500 animate-float">
          {/* Inner Blur - Changed to red/orange/amber */}
          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 rounded-3xl blur opacity-60 animate-gradient-x"></div>
          <div className="relative space-y-6 z-10">
            {/* Title Color - Changed to amber-400 */}
            <h2 className="text-2xl font-bold text-amber-400 text-center">Join a Room</h2>

            <div className="space-y-4">
              <div className="flex flex-col relative">
                <label className="text-sm text-gray-300 mb-1">Your Display Name</label>
                <input
                  // Focus Ring - Changed to amber-400
                  className="p-3 rounded-xl bg-black/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition duration-200 relative z-10"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  maxLength={20}
                  disabled
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-sm text-gray-300 mb-1">Room ID</label>
                <input
                  // Focus Ring - Changed to amber-400
                  className="p-3 rounded-xl bg-black/50 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400 transition duration-200 relative z-10"
                  placeholder="Enter Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              </div>

              <button
                // Button Gradient and Hover Shadow - Changed to red/orange/amber
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 font-semibold text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,160,0,0.7)] hover:scale-[1.05] transition-all duration-300 disabled:opacity-50"
                onClick={joinExistingRoom}
                disabled={!userName.trim() || !roomId.trim()}
              >
                Join Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tailwind animations */}
      <style>{`
        @keyframes animate-gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: animate-gradient-x 8s ease infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
        .animate-[pulse_20s_infinite] { animation: pulse 20s infinite; }
      `}</style>
    </>
  );
};

export default RoomPage;