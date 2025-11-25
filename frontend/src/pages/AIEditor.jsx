import React, { useState, useEffect, useCallback } from "react";
import { Sandpack } from "@codesandbox/sandpack-react";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Zap, Users, Edit, CheckSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import NavBar from "../components/NavBar";

const API_IO_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000" // Base URL for the services (Development)
    : "";

const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/room" // Base URL for the services (Development)
    : "/api/room";

// Mock authentication hook
const useAuthStore = () => {
  const uniqueKey = "authUserId_" + window.location.href;
  const tempId =
    localStorage.getItem(uniqueKey) ||
    "temp_" + Math.random().toString(36).substring(2, 9);
  if (!localStorage.getItem(uniqueKey)) localStorage.setItem(uniqueKey, tempId); // ✅ FIX: Use the correct key: "userDisplayName"

  const actualName = localStorage.getItem("userDisplayName"); // Fallback name generation (simplified)

  const idFragment = tempId.substring(tempId.indexOf("_") + 1);
  const numericSuffix = parseInt(idFragment, 36) % 10000;
  const finalDisplayName =
    actualName && actualName.trim()
      ? actualName.trim()
      : `Guest ${numericSuffix}`; // Use fallback only if name is missing

  return {
    user: {
      _id: tempId,
      name: finalDisplayName, // ⬅️ Use the stored/fallback name
    },
  };
};

// Socket instance
const socket = io(API_IO_URL);

// Framer Motion Variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};
const slideIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};
const scaleUp = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const initialFragment = `
import React from "react";

export default function App() {
  return (
    <>
      <h1 className="text-3xl font-extrabold text-cyan-600 mb-2">Live Preview</h1>
      <p className="text-gray-700">Request the turn and generate some HTML/Tailwind code to see the result here instantly.</p>
    </>
  );
}
`;

const AIEditor = () => {
  const { user } = useAuthStore();
  const { roomId } = useParams();
  const currentUserId = user ? user._id : "unknown_user";

  const [code, setCode] = useState(initialFragment);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentEditorId, setCurrentEditorId] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [roomName, setRoomName] = useState("Loading...");
  const messageTimeout = React.useRef(null);

  const canEdit = currentEditorId === currentUserId;

  const showStatusMessage = useCallback((message) => {
    setStatusMessage(message);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setStatusMessage(""), 5000);
  }, []);

  const fetchRoomDetails = useCallback(async (id) => {
  try {
   const res = await axios.get(`${API_BASE_URL}/${id}`, { withCredentials: true });
   if (res.data.room && res.data.room.name) {
    setRoomName(res.data.room.name);
   } else {
    setRoomName("Untitled Room");
   }
  } catch (error) {
   console.error("Error fetching room details:", error);
   setRoomName("Error: Failed to Load");
  }
 }, []);

  // Sandpack files with dynamic Tailwind injection
  const [sandpackFiles, setSandpackFiles] = useState({
    "/App.js": { code: initialFragment, readOnly: !canEdit },
    "/index.js": `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Dynamically inject Tailwind CDN
const script = document.createElement("script");
script.src = "https://cdn.tailwindcss.com";
script.async = true;
document.head.appendChild(script);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
    `,
    "/index.css": `
body {
  margin: 0;
  font-family: system-ui, sans-serif;
}
    `,
  });

  useEffect(() => {
    setSandpackFiles((prev) => ({
      ...prev,
      "/App.js": { ...prev["/App.js"], code },
    }));
  }, [code]);

  // Socket listeners
  useEffect(() => {
    socket.on("codeUpdated", (newCode) => {
      setCode(newCode);
      showStatusMessage("✅ New changes applied from the previous editor.");
    });

    socket.on("turnGranted", (editorId) => {
      setCurrentEditorId(editorId);
      setHasJoined(true);
      if (editorId === currentUserId)
        showStatusMessage("✏️ You now have the editing turn!");
      else if (editorId)
        showStatusMessage(
          `🔒 Editing turn taken by User ${editorId.substring(0, 5)}...`
        );
      else
        showStatusMessage(
          "➡️ The editing turn is now free. Request to start editing."
        );
    });

    socket.on("activeUsersUpdated", (users) => setActiveUsers(users));

    // AIEditor.jsx (around line 105)

    if (roomId && currentUserId !== "unknown_user") {
      fetchRoomDetails(roomId);
      socket.emit("joinRoom", {
        roomId,
        userId: currentUserId,
        userName: user.name, // ⬅️ Sends the actual name (e.g., "Alice")
      });
    }

    return () => {
      socket.off("codeUpdated");
      socket.off("turnGranted");
      socket.off("activeUsersUpdated");
      if (messageTimeout.current) clearTimeout(messageTimeout.current);
    };
  }, [roomId, currentUserId, showStatusMessage,fetchRoomDetails, user.name]);

  const requestTurn = () => {
    if (!currentEditorId)
      socket.emit("requestTurn", { roomId, userId: currentUserId });
    else
      showStatusMessage(
        `❌ Cannot request turn. User ${currentEditorId.substring(
          0,
          5
        )} is currently editing.`
      );
  };

  const finishTurn = () => {
    if (canEdit) {
      socket.emit("finishTurn", {
        roomId,
        userId: currentUserId,
        finalCode: code,
      });
      showStatusMessage("📤 Changes sent and awaiting server confirmation...");
    }
  };

  const generateCode = async () => {
    if (!prompt || !canEdit) {
      showStatusMessage("⚠️ You must have the editing turn to generate code.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_IO_URL}/generate-code`, {
        prompt,
      });
      const newFragment =
        res.data.code || "<p><!-- AI generated empty response --></p>";
      setCode(newFragment);
      showStatusMessage(
        "🤖 AI generated code locally. Click 'Finish Editing' to share."
      );
    } catch (err) {
      console.error(err);
      setCode(`<p>// Error generating code. Details: ${err.message}</p>`);
    }
    setLoading(false);
  };

 const currentEditorName =
  currentEditorId === currentUserId
   ? "You"
   : currentEditorId
   ? activeUsers.find(user => user.userId === currentEditorId)?.userName || `User ${currentEditorId.substring(0, 5)}...` // ⬅️ UPDATED: Look up the userName from activeUsers
   : "No one (Free to request)";
  const editorStatusColor =
    currentEditorId === currentUserId
      ? "bg-green-700 text-white"
      : currentEditorId
      ? "bg-red-700 text-white"
      : "bg-yellow-700 text-white";

  return (
    <>
    <div className="z-20">
        <NavBar />
      </div>
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8 font-sans"
    >
      <motion.header
        variants={slideIn}
        className="mb-6 border-b pb-4 border-gray-700 flex justify-between items-center" // ⬅️ Added flex and justify-between
      >
        {/* 1. Main Title (Left side) */}
        <h1 className="text-4xl font-extrabold text-cyan-400 flex items-center">
          <Zap className="mr-3 h-8 w-8 text-yellow-400" /> CodeSense Canvas –
        Room: <span className="text-white ml-2">{roomName}</span>
        </h1>

        {/* 2. Framework Status Message (Right side) */}
        <div className="hidden sm:block">
          {" "}
          {/* Hide on small screens if necessary */}
          <span className="px-3 py-1 bg-cyan-700 text-cyan-100 font-bold rounded-full text-sm shadow-lg">
            Framework: React js
          </span>
           <span className="px-3 py-1 bg-cyan-700 text-cyan-100 font-bold rounded-full text-sm shadow-lg">
            Room Code: {roomId}
          </span>
        </div>
      </motion.header>

      {/* Users & Controls */}
      <div className="mb-6 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={
            statusMessage ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }
          }
          className="p-3 bg-indigo-800 rounded-lg text-sm font-medium text-indigo-100 min-h-[40px]"
        >
          {statusMessage}
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 p-3 bg-gray-800 rounded-lg shadow-inner flex items-center">
            <Users className="w-5 h-5 mr-3 text-cyan-400" />
            <span className="font-semibold text-gray-300 mr-2">
              Online Users ({[...new Set(activeUsers)].length}):
            </span>
            <div className="flex flex-wrap gap-2 text-sm">
              {activeUsers.map(
                (
                  user // ⬅️ Map over user objects
                ) => (
                  <span
                    key={user.userId} // ⬅️ Use user.userId for the key
                    className={`px-3 py-1 rounded-full font-medium ${
                      user.userId === currentUserId // ⬅️ Compare user.userId
                        ? "bg-indigo-600 text-white border-2 border-yellow-400"
                        : "bg-gray-700 text-gray-300"
                    }`}
                    title={user.userId} // ⬅️ Still useful to show the ID on hover
                  >
                    {user.userId === currentUserId
                      ? `${user.userName} (You)` // ⬅️ Use user.userName for the current user
                      : user.userName}
                  </span>
                )
              )}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg shadow-lg font-bold text-center w-full sm:w-1/4 flex items-center justify-center ${editorStatusColor}`}
          >
            <Edit className="mr-2 h-5 w-5" /> Editor: {currentEditorName}
          </div>
        </div>

        <div className="flex gap-3">
          {!canEdit ? (
            <motion.button
              onClick={requestTurn}
              disabled={!hasJoined || !!currentEditorId}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full px-4 py-3 font-bold rounded-xl transition-colors duration-200 shadow-md ${
                !hasJoined || !!currentEditorId
                  ? "bg-gray-500 text-gray-400 cursor-not-allowed opacity-70"
                  : "bg-yellow-500 text-gray-900 hover:bg-yellow-400"
              }`}
            >
              Request Editing Turn
            </motion.button>
          ) : (
            <motion.button
              onClick={finishTurn}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-3 font-bold rounded-xl transition-colors duration-200 bg-green-500 text-gray-900 hover:bg-green-400 shadow-md flex items-center justify-center"
            >
              <CheckSquare className="mr-2 h-5 w-5" /> Finish Editing Turn &
              Publish Changes
            </motion.button>
          )}
        </div>
      </div>

      {/* Prompt & Generate */}
      <div>
        <motion.div
          variants={slideIn}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-3 text-cyan-200">
            Your Prompt
          </h2>
          <textarea
            rows="5"
            placeholder={
              canEdit
                ? "e.g., A pricing card component with a hover effect..."
                : "Request the editing turn to use the AI generator..."
            }
            className="w-full p-4 border border-gray-700 bg-gray-800 text-white rounded-xl shadow-xl focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition duration-300 placeholder-gray-500 disabled:opacity-50"
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateCode()}
            value={prompt}
            disabled={!canEdit}
          />
        </motion.div>

        <motion.div
          variants={slideIn}
          initial="hidden"
          animate="visible"
          custom={0.4}
        >
          <motion.button
            onClick={generateCode}
            disabled={loading || !prompt || !canEdit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-6 py-4 text-lg font-bold rounded-xl shadow-2xl transition duration-300 ${
              loading || !prompt || !canEdit
                ? "bg-cyan-700 text-gray-400 cursor-not-allowed opacity-70"
                : "bg-cyan-500 text-gray-900 hover:bg-cyan-400"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin inline-block mr-2 h-5 w-5" />
            ) : (
              "Generate Code (Local Edit)"
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Editor & Live Preview */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-8 lg:space-y-0">
        {/* Code Editor */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-cyan-200">
            Code Editor
          </h2>
          <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden bg-gray-800 border border-cyan-500/50 relative"
          >
           {!canEdit && (
              <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm z-10 flex items-center justify-center p-8 text-center">
                <p className="text-xl font-bold text-red-400">
                  <Edit className="inline-block w-6 h-6 mr-2" />
                  READ-ONLY MODE:{" "}
                  {currentEditorId
                    ? `${currentEditorName} is currently editing.` // ⬅️ UPDATED LINE
                    : "The editing turn is currently free."}
                  <br />
                  Request the turn to make changes.
                </p>
              </div>
            )}
            <CodeMirror
              value={code}
              height="700px"
              extensions={[javascript(), EditorView.lineWrapping]}
              onChange={(value) => canEdit && setCode(value)}
              editable={canEdit}
              theme="dark"
              basicSetup={{ lineNumbers: true, tabSize: 2 }}
            />
          </motion.div>
        </div>

        {/* Live Preview */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-cyan-200">
            Live Preview
          </h2>
          <motion.div
            variants={scaleUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.3)] overflow-hidden bg-gray-100 h-[700px] border border-cyan-500/50 relative"
          >
            <Sandpack
              key={code}
              template="react"
              files={sandpackFiles}
              options={{
                showLineNumbers: false,
                showConsole: false,
                autorun: true,
                editorHeight: 700,
                layout: "preview",
                theme: "dark",
              }}
              customSetup={{
                dependencies: {
                  react: "18.2.0",
                  "react-dom": "18.2.0",
                  "framer-motion": "10.12.16",
                  "lucide-react": "0.277.0",
                },
              }}
            />
          </motion.div>
          <p className="mt-2 text-sm text-gray-400 text-center">
            *Code updates live here. Remember to click **Publish Changes** to
            save and share the final result.
          </p>
        </div>
      </div>
    </motion.div>
    </>

  );
};

export default AIEditor;
