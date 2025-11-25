import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Changed 'Users' icon to 'UserCheck' for total members vs. 'User' for creator
import { UserCheck, Code, Loader2, Signal, Menu } from 'lucide-react'; 
import { motion } from 'framer-motion';
import AdminSideBar from './AdminSideBar';
import NavBar from '../components/NavBar';

// Use the same environment variable setup as your other components
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/room" 
    : "/api/room"; 

// Framer Motion Variants for a nice staggered appearance
const RoomsListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Delay between list items appearing
    },
  },
};

const RoomItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const AdminRooms = () => {
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
     const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        // 🎯 Fetch all rooms data from the backend admin endpoint
        const response = await axios.get(`${API_BASE_URL}/admin/rooms`, { // Corrected path based on previous fix
          withCredentials: true,
        });
        setRooms(response.data.rooms || []);
        console.log(response)
      } catch (err) {
        console.error('Error fetching admin rooms:', err);
        setError('Failed to fetch rooms. Check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    // Optional: Refresh the data every 30 seconds
    const intervalId = setInterval(fetchRooms, 30000); 

    return () => clearInterval(intervalId);
  }, []);
 const mainContentClass = `flex-1 transition-all duration-300 ease-in-out p-6 pt-4 lg:ml-64`;
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-cyan-400">
        <Loader2 className="w-8 h-8 animate-spin mr-3" />
        <span className="text-xl">Loading room data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
        <p className="p-4 bg-gray-800 rounded-lg shadow-xl">
          Error: {error}
        </p>
      </div>
    );
  }

  return (
     <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sidebar and Header components remain the same */}
      <AdminSideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="z-20">
        <NavBar />
      </div>
       <header className="lg:ml-64 sticky top-0 bg-white shadow-lg p-4 flex items-center h-16 z-20">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-4 lg:hidden text-gray-600 hover:text-gray-900 transition duration-150 rounded-full hover:bg-gray-200"
          aria-label="Open sidebar menu"
        >
          <Menu size={24} />
        </button>
        <motion.div className="relative inline-block">
          <motion.h1
            className="text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Admin Dashboard
          </motion.h1>
          <motion.span
            className="absolute left-0 -bottom-1 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 0.8,
              delay: 0.7,
              type: "spring",
              stiffness: 120,
            }}
          />
        </motion.div>
      </header>
      <div className={mainContentClass}>
      {rooms.length === 0 ? (
        <p className="text-gray-400 text-xl mt-12 p-8 bg-gray-800 rounded-xl shadow-lg">
          No active rooms found on the server.
        </p>
      ) : (
        <motion.ul 
          variants={RoomsListVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {rooms.map((room) => (
            <motion.li
              key={room._id}
              variants={RoomItemVariants}
              className="bg-gray-800 p-6 rounded-xl shadow-2xl border-l-4 border-cyan-500 hover:border-cyan-400 transition duration-300"
            >
              {/* Room Header */}
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Code className="mr-3 w-6 h-6 text-cyan-400" />
                  {room.name || `Room ID: ${room._id}`}
                </h2>
                <div className="text-lg font-semibold text-yellow-400 flex items-center">
                  <UserCheck className="mr-2 w-5 h-5" />
                  {/* 🎯 CHANGE 1: Use room.users.length for total members */}
                  {room.users ? room.users.length : 0} Total Members
                </div>
              </div>

              {/* Creator of the Room Section */}
              <div className="text-gray-300">
                {/* 🎯 CHANGE 2: Update section title */}
                <p className="font-semibold mb-2 text-gray-400">
                  Creator of the Room:
                </p>
                  
                <div className="flex flex-wrap gap-3">
                  {/* 🎯 CHANGE 3: Display admin name */}
                  <span
                    className="px-3 py-1 bg-purple-700/50 text-purple-100 rounded-full text-sm font-medium hover:bg-purple-600 transition"
                  >
                    {room.admin?.name || 'Unknown Admin'}
                  </span>
                </div>

              </div>
              

              
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div></div>
  );
};

export default AdminRooms;