import React, { useState, useEffect } from "react";
import {
  Menu,
  Home,
  Users,
  Mail,
  Phone,
  User,
  ArrowLeft,
  ArrowRight,
  Loader2, // New for loading indicator
  // DollarSign, // REMOVED: Payment-related icon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import NavBar from "../components/NavBar";

import AdminSideBar from "./AdminSideBar";
import {
  // REMOVED: Recharts imports (LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer)
  // These are no longer needed without the PaymentsChart
} from "recharts";

// 1. Framer Motion Variants for the Table Rows
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05, // Stagger rows entry
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }, // Faster exit for smoother page change
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

// REMOVED: PaymentsChart component entirely
/*
// const PaymentsChart = ({ data }) => {
// ... (code for PaymentsChart component)
// };
*/

const AdminUsers = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const { fetchAllUsers } = useAuthStore();
  // REMOVED: Payment data state
  // const [dailyPaymentsData, setDailyPaymentsData] = useState([]);

  // 2. Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // Maximum users per page

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to fetch users and handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };
    const loadUsers = async () => {
      setIsLoading(true);
      try {
        const users = await fetchAllUsers();
        setUsersList(users);

        // --- REMOVED: DATA PROCESSING FOR CHART (Payment logic) ---
        /*
        const paymentMap = new Map();
        users.forEach((user) => {
          user.paymentHistory?.forEach((payment) => {
            // ... (payment processing logic)
          });
        });
        let chartData = Array.from(paymentMap, ([date, totalAmount]) => ({
          date,
          totalAmount,
        }));
        chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
        setDailyPaymentsData(chartData);
        */
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fetchAllUsers]);

  // 3. Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = usersList.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(usersList.length / usersPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const mainContentClass = `flex-1 transition-all duration-300 ease-in-out p-6 pt-4 lg:ml-64`;

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
      {/* End of Header */}

      <div className={mainContentClass}>
        {/* REMOVED: The payment chart rendering block 
        <div className="bg-white p-4 rounded-xl shadow-2xl mb-8">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
              <p className="text-lg text-gray-600">
                Preparing dashboard data...
              </p>
            </div>
          ) : (
            <PaymentsChart data={dailyPaymentsData} />
          )}
        </div>
        */}
        <div className="bg-white p-6 rounded-xl shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
            <Users className="w-8 h-8 mr-3 text-indigo-500" />
            All Users
          </h2>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mr-3" />
              <p className="text-lg text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* The table structure is now simple HTML */}
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header remains the same */}
                <thead className="bg-indigo-600 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-lg">
                      <User className="inline w-4 h-4 mr-1" /> Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      <Mail className="inline w-4 h-4 mr-1" /> Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      <Phone className="inline w-4 h-4 mr-1" /> Phone
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Verified
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-lg">
                      Last Login
                    </th>
                  </tr>
                </thead>

                {/* 🛑 CORE FIX: Apply AnimatePresence and motion to the Tbody/Rows */}
                <AnimatePresence mode="wait" initial={false}>
                  <motion.tbody
                    key={currentPage} // Apply key here to trigger transition
                    className="bg-white divide-y divide-gray-200"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {currentUsers.length > 0 ? (
                      currentUsers.map((u) => (
                        <motion.tr
                          key={u._id}
                          className="hover:bg-indigo-50 transition-colors duration-200"
                          variants={itemVariants} // Apply item animation
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {u.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {u.phone || (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                u.isVerified
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {u.isVerified ? "Verified" : "Unverified"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                            {u.paidPlan ? u.paidPlan : "Free"}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {u.lastLogin ? (
                              new Date(u.lastLogin).toLocaleString()
                            ) : (
                              <span className="text-gray-400">Never</span>
                            )}
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <motion.tr
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <td
                          colSpan="6" // Updated colspan from 5 to 6 to account for the removed payment column
                          className="px-6 py-8 text-center text-gray-500 text-lg"
                        >
                          No users found.
                        </td>
                      </motion.tr>
                    )}
                  </motion.tbody>
                </AnimatePresence>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-6 flex justify-center items-center p-4 border-t border-gray-200">
              {/* <span className="text-sm text-gray-700">
								Showing **{indexOfFirstUser + 1}** to **
								{Math.min(indexOfLastUser, usersList.length)}** of **
								{usersList.length}** entries
							</span> */}
              <div className="flex space-x-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-colors flex items-center"
                  aria-label="Previous page"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Previous
                </button>
                <span className="px-4 py-2 text-sm font-bold text-gray-700 bg-gray-200 rounded-lg">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 transition-colors flex items-center"
                  aria-label="Next page"
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;