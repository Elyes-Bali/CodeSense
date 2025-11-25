import React, { useState, useEffect, useMemo } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  ClipboardCheck,
  Tally3,
  Menu,
  X,
  ArrowRight,
  DollarSign,
  University,
  GraduationCap,
  Sparkles,
  CheckCircle,
  Quote,
  PlayCircle, // Added for video section icon
} from "lucide-react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Canvas } from "@react-three/fiber";
import useSound from "use-sound";
// --- Framer Motion Variants for Staggered Animations ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      ease: "easeOut",
    },
  },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// --- Feature Data (Updated for CodeSense collaboration + AI) ---
const features = [
  {
    icon: BookOpen,
    title: "Collaborative Coding Rooms",
    description:
      "Create private or public rooms to code together in real time — share a single workspace with friends, teammates, or classmates.",
  },
  {
    icon: HelpCircle,
    title: "Live Sandpack Previews",
    description:
      "Instantly preview code using Sandpack inside the room so everyone sees the same running app as you edit and iterate.",
  },
  {
    icon: Lightbulb,
    title: "AI-Assisted Code Generation",
    description:
      "Use the integrated AI generator to produce code from prompts, scaffold components, or get implementation suggestions during your session.",
  },
  {
    icon: ClipboardCheck,
    title: "Share Knowledge & Review",
    description:
      "Post snippets, annotate, and review each other's work. Leave comments, accept suggestions, and learn from peers in the same room.",
  },
  {
    icon: Tally3,
    title: "Practice, Teach & Pair Program",
    description:
      "Run pair-programming sessions, mock interviews, or study groups — all inside a dedicated collaborative environment.",
  },
];

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  // Animated Button Component
  const AnimatedButton = ({
    children,
    className = "",
    href = "#",
    delay = 0.5,
  }) => (
    <motion.a
      href={href}
      className={`px-10 py-4 font-extrabold text-lg rounded-full transition-all duration-300 transform inline-flex items-center justify-center space-x-3 ${className}`}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 15px 30px rgba(79, 70, 229, 0.6)",
        y: -4,
      }}
      whileTap={{ scale: 0.95, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, type: "spring", stiffness: 150, damping: 15 }}
    >
      {children}
    </motion.a>
  );

  // Navigation Component
  const Nav = () => (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="sticky top-0 z-50 bg-white/98 backdrop-blur-lg shadow-xl border-b border-gray-100"
    >
      <div className="w-full px-8 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo/Brand */}
        <div className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <GraduationCap className="w-8 h-8 mr-2 text-orange-500" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400">
            <NavLink to="/">CodeSense</NavLink>
          </span>
        </div>

        {/* Desktop Menu */}
        {user?.role !== "admin" ? (
          <nav className="hidden md:flex space-x-10">
            <a
              href="/"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Home
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>

            <a
              href="/room"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              WorkSpace
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>

            <a
              href="/profile"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Profile
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                LogOut
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            ) : (
              <a
                href="/login"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Login
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </a>
            )}
          </nav>
        ) : (
          <nav className="hidden md:flex space-x-10">
            <a
              href="/dashboard"
              className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
            >
              Dashboard
              <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
            </a>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                LogOut
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </button>
            ) : (
              <a
                href="/login"
                className="text-gray-600 hover:text-indigo-700 font-semibold transition-colors relative group py-1"
              >
                Login
                <span className="absolute left-0 bottom-0 h-[3px] w-0 group-hover:w-full bg-indigo-500 transition-all duration-300" />
              </a>
            )}
          </nav>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-indigo-50 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu Content */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: {
            height: "auto",
            opacity: 1,
            transition: { type: "spring", stiffness: 200, damping: 20 },
          },
          closed: { height: 0, opacity: 0, transition: { duration: 0.3 } },
        }}
      >
        {user?.role !== "admin" ? (
          <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
            <NavLink
              to="/"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/room"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              WorkSpace
            </NavLink>
            <NavLink
              to="/profile"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Profile
            </NavLink>

            <NavLink
              to="/contuct-us"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </NavLink>
          </div>
        ) : (
          <div className="flex flex-col space-y-2 p-4 border-t border-gray-100">
            <NavLink
              to="/dashboard"
              className="block p-3 text-gray-700 hover:bg-indigo-50 rounded-lg transition-colors font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          </div>
        )}
      </motion.div>
    </motion.header>
  );

  // Hero Section - updated for CodeSense

const HeroSection = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Mouse glow effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouse = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  return (
    <motion.section
      id="home"
      onMouseMove={handleMouse}
      style={{ opacity, scale }}
      className="relative pt-24 pb-40 bg-[#070B16] text-white overflow-hidden flex items-center justify-center min-h-[90vh]"
    >
      {/* Mouse-follow glow */}
      <motion.div
        // **COLOR CHANGE: bg-[radial-gradient(circle,#ff6464,transparent)] (crimson-like)**
        className="pointer-events-none fixed w-[350px] h-[350px] rounded-full blur-[180px] opacity-25 bg-[radial-gradient(circle,#ff6464,transparent)]"
        animate={{
          x: mousePos.x - 175,
          y: mousePos.y - 175,
        }}
        transition={{ type: "spring", damping: 20 }}
      />

      {/* Floating AI keywords */}
      {["AI", "Collaboration", "Sandpack", "Real-time"].map((word, i) => {
        const randomY = useMemo(() => Math.random() * 50, []);
        const randomX = useMemo(() => Math.random() * 200, []);
        const depth = i * 0.15 + 1; // control parallax depth

        return (
          <motion.span
            key={i}
            // **COLOR CHANGE: text-red-300/20**
            className="absolute text-red-300/20 font-semibold text-lg will-change-transform"
            initial={{
              y: randomY,
              x: randomX,
              opacity: 0,
              rotate: Math.random() * 10 - 5, // slight random tilt
              scale: 1 / depth, // smaller if “further away”
            }}
            animate={{
              y: -20 / depth, // deeper objects move slightly less
              x: `+=${5 * (i % 2 === 0 ? 1 : -1)}`, // slow sideways drift
              rotate: 0,
              opacity: 0.5,
            }}
            transition={{
              duration: 6 + i * 0.5,
              delay: i * 0.4,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut",
            }}
            style={{
              top: `${40 + i * 10}%`,
              left: `${20 + i * 15}%`,
              zIndex: 5 - i, // closer elements on top
            }}
          >
            {word}
          </motion.span>
        );
      })}

      {/* Animated background layers retained */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          // **COLOR CHANGE: rgba(255,100,0,0.12) (orange/red-like)**
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(255,100,0,0.12), transparent 80%), radial-gradient(circle at 70% 80%, rgba(255,165,0,0.12), transparent 80%)",
        }}
      />

      {/* Rotating Light Beam */}
      <motion.div
        // **COLOR CHANGE: from-red-400 via-orange-500 to-yellow-400**
        className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-gradient-to-br from-red-400 via-orange-500 to-yellow-400 opacity-10 rounded-full blur-[250px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />

      {/* Subtle grid (no change needed here as it's white/transparent) */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Text & Preview */}
      <div className="w-full px-10 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* ✨ Left Section – Updated Title Only */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-left max-w-xl"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-orange-500 to-yellow-400">
                {/* **COLOR CHANGE: from-red-400 via-orange-500 to-yellow-400** */}
                Code Smarter.
              </span>
              <span className="block mt-1 text-white">
                Collaborate Faster.
              </span>
              <span className="block mt-1 text-orange-300">
                {/* **COLOR CHANGE: text-orange-300** */}
                Build Together.
              </span>
            </h1>

            <p className="mt-5 text-gray-400 max-w-md text-lg">
              Launch real-time coding sessions with AI-assisted workflows and
              instant live previews.
            </p>

            <Link to="/room">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // **COLOR CHANGE: from-red-500 via-orange-500 to-yellow-500**
                // **SHADOW CHANGE: hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] (orange glow)**
                className="mt-8 px-8 py-3 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 rounded-md text-lg font-medium shadow-xl hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all"
              >
                🚀 Start Now
              </motion.button>
            </Link>
          </motion.div>

          {/* Right - Terminal Preview */}
          <motion.div
            className="hidden lg:flex justify-center"
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="w-full max-w-md h-[400px] bg-gray-900/80 border border-orange-400/20 shadow-[0_0_30px_rgba(255,165,0,0.3)] rounded-xl p-4 flex flex-col">
              {/* **COLOR CHANGE: text-red-400** */}
              <div className="text-red-400 font-mono text-xs mb-2 opacity-80">
                ▶ Room: AI-Powered Session
              </div>
              <motion.div
                className="flex-1 bg-black rounded-md px-4 py-3 text-sm text-gray-300 font-mono"
                animate={{ opacity: [0.7, 0.9, 0.7] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  $ npm start
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  Starting Sandpack dev server...
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3 }}
                >
                  Sandpack dev server ready 
                </motion.p>
                <motion.p
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  // **COLOR CHANGE: text-orange-400**
                  className="text-orange-400 mt-2" 
                >
                  <span>┃</span> Start a room now !
                </motion.p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

  // Feature Card Component - Enhanced Design with 3D feel
const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    // **SHADOW CHANGE:** hover:shadow-orange-300/40
    className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 flex flex-col items-start h-full transform-gpu overflow-hidden transition-shadow duration-300 hover:shadow-orange-300/40 group"
    variants={itemVariants}
    whileHover={{
      y: -15,
      boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)",
      scale: 1.03,
      rotateY: [0, 1, -1, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    }}
    transition={{ delay: delay, duration: 0.5 }}
  >
    <div className="relative z-10">
      <div 
        // **GRADIENT CHANGE: from-red-600 to-orange-500**
        className="p-4 mb-4 bg-gradient-to-br from-red-600 to-orange-500 rounded-xl text-white shadow-xl transform transition-transform duration-300 group-hover:scale-110"
      >
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-2xl font-extrabold text-gray-900 mb-3 leading-snug">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
    </div>
    {/* Background shape blur */}
    <div 
      // **BACKGROUND COLOR CHANGE: bg-red-200**
      className="absolute top-0 right-0 w-24 h-24 bg-red-200 rounded-full filter blur-3xl opacity-10 transition-opacity duration-500 group-hover:opacity-20"
    ></div>
  </motion.div>
);

  // Features Section
  const FeaturesSection = () => (
    <section
      id="features"
      className="py-32 bg-gradient-to-b from-white to-indigo-50 border-t border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            className="text-base text-orange-500 font-semibold tracking-wide uppercase flex justify-center items-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
            Core Capabilities
          </motion.p>
          <motion.h2
            className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Tools for real collaboration & hands-on learning
          </motion.h2>
        </div>

        {/* Outer container for the grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Row 1: The first 3 features are mapped directly into the 3-column grid */}
          {features.slice(0, 3).map((feature, index) => (
            <div key={feature.title}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 0.1}
              />
            </div>
          ))}

          {/* Row 2: Contains a flex container spanning all columns to center the remaining 2 cards */}
          <div className="lg:col-span-3">
            <motion.div
              // This is the fix: use flexbox on the wrapper to center the remaining items
              className="flex justify-center flex-wrap gap-12 pt-0 lg:pt-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.slice(3, 5).map((feature, index) => (
                <div
                  key={feature.title}
                  className="w-full md:w-1/2 lg:w-96 max-w-sm"
                >
                  <FeatureCard
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    // Adjust delay based on the index in the original array (3 and 4)
                    delay={(index + 3) * 0.1}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Video Showcase Section (kept but copy updated)
  const VideoShowcaseSection = () => {
    // Placeholder video data (replace src with actual embedded URLs or video links)
 const videos = [
  {
    title: "Live Room Collaboration Demo",
    description:
      "See how two developers edit the same project, preview changes live with Sandpack, and use AI to scaffold components.",
    // Cloudinary Link 1: Collaboration_mcirx7.mp4
    src: "https://res.cloudinary.com/dgl9rp1vu/video/upload/v1764076410/Collaboration_mcirx7.mp4", 
  },
  {
    title: "AI Code Generation Workflow",
    description:
      "Watch how a prompt transforms into working code inside a collaborative room and becomes instantly visible to everyone.",
    // Cloudinary Link 2: generator-AI_t9suhz.mp4
    src: "https://res.cloudinary.com/dgl9rp1vu/video/upload/v1764075990/generator-AI_t9suhz.mp4",
  },
];
    const VideoCard = ({ title, description, src, delay }) => (
      <motion.div
        className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col h-full overflow-hidden"
        variants={itemVariants}
        whileHover={{
          y: -8,
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 70, 229, 0.3)",
        }}
        transition={{ delay: delay, duration: 0.5 }}
      >
        {/* Video Embed Container */}
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-6 relative group">
          <iframe
            className="w-full h-full transform transition-transform duration-500 group-hover:scale-[1.03]"
            src={src}
            title={title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          {/* Play Icon Overlay (Optional visual cue) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <PlayCircle className="w-16 h-16 text-white/80 drop-shadow-lg" />
          </div>
        </div>

        <h3 className="text-3xl font-extrabold text-gray-900 mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
      </motion.div>
    );

    return (
      <section
        id="video-showcase"
        className="py-24 bg-gray-50 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <motion.p
              className="text-base text-teal-700 font-semibold tracking-wide uppercase flex justify-center items-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              <PlayCircle className="w-5 h-5 mr-2 text-teal-600" />
              See It In Action
            </motion.p>
            <motion.h2
              className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              Collaborative sessions & AI-powered coding
            </motion.h2>
          </div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {videos.map((video, index) => (
              <VideoCard
                key={video.title}
                title={video.title}
                description={video.description}
                src={video.src}
                delay={index * 0.15}
              />
            ))}
          </motion.div>
        </div>
      </section>
    );
  };

  // Testimonial / Trust Section (tweaked copy)
  const TestimonialSection = () => (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center ">
        <motion.div
          className="p-8 md:p-12 bg-gray-50 rounded-2xl shadow-xl border border-gray-100"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 80, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <Quote className="w-12 h-12 text-orange-500 mx-auto mb-6 transform -rotate-180" />
          <p className="text-2xl md:text-3xl font-serif italic text-gray-800 leading-snug mb-8">
            "CodeSense let our study group collaborate on real projects — we
            debug together, prototype faster with AI and our workflows actually
            improved."
          </p>
          <div className="font-semibold text-lg text-gray-900">
            Sami T.,{" "}
            <span className="text-orange-500">Software Student & Mentor</span>
          </div>
        </motion.div>
      </div>
    </section>
  );

  // Pricing Section - keep structure but adapt copy slightly
  const PricingCard = ({
    title,
    price,
    features,
    isPro,
    ctaText,
    ctaClass,
    delay,
  }) => (
    <motion.div
      className={`p-10 rounded-3xl shadow-3xl border-4 h-full flex flex-col transform-gpu transition-all duration-300 relative overflow-hidden group ${
        isPro
          ? "bg-gradient-to-br from-gray-900 to-indigo-900 text-white border-teal-400 scale-[1.07] z-10"
          : "bg-white text-gray-900 border-gray-200"
      }`}
      variants={itemVariants}
      whileHover={{
        y: isPro ? -15 : -8,
        boxShadow: isPro
          ? "0 40px 80px rgba(79, 70, 229, 0.5)"
          : "0 20px 40px rgba(0, 0, 0, 0.1)",
      }}
      transition={{ delay: delay, duration: 0.5 }}
    >
      {isPro && (
        <div className="absolute top-0 right-0 -mr-2 -mt-2 bg-teal-400 text-gray-900 text-sm font-extrabold uppercase py-2 px-6 rounded-bl-lg shadow-md rotate-3 translate-x-3 translate-y-3">
          TOP VALUE
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3
          className={`text-4xl font-extrabold ${
            isPro ? "text-teal-400" : "text-indigo-700"
          }`}
        >
          {title}
        </h3>
      </div>
      <div className="text-7xl font-extrabold mb-8 flex items-baseline">
        {price}
        <span
          className={`text-xl font-medium ml-2 ${
            isPro ? "text-indigo-300" : "text-gray-500"
          }`}
        >
          /month
        </span>
      </div>

      <ul className="space-y-4 mb-12 flex-grow">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            className="flex items-start space-x-3"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + index * 0.1, duration: 0.3 }}
            viewport={{ once: true }}
          >
            <CheckCircle
              className={`flex-shrink-0 w-6 h-6 ${
                isPro ? "text-teal-400" : "text-green-500"
              }`}
            />
            <span className={isPro ? "text-indigo-100" : "text-gray-700"}>
              {feature}
            </span>
          </motion.li>
        ))}
      </ul>

      <a
        href="/plans"
        className={`mt-auto text-center py-5 rounded-full font-bold text-xl transition-all duration-300 shadow-2xl transform group-hover:scale-[1.01] ${ctaClass}`}
      >
        {ctaText}
      </a>
    </motion.div>
  );

  const PricingSection = () => (
    <section id="pricing" className="py-32 bg-gray-950 text-white">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.p
            className="text-base text-teal-400 font-semibold tracking-wide uppercase flex justify-center items-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Unlock Team & Pro Features
          </motion.p>
          <motion.h2
            className="mt-4 text-4xl md:text-5xl font-extrabold text-white leading-tight"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
          >
            Simple, Transparent Pricing for builders
          </motion.h2>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Free Tier */}
          <PricingCard
            title="Starter"
            price="0 $"
            features={[
              "Create public rooms",
              "Limited AI generations per day",
              "Sandpack previews in-room",
              "Community support",
            ]}
            isPro={false}
            ctaText="Get Started Free"
            ctaClass="bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            delay={0}
          />

          {/* Premium */}
          <PricingCard
            title="Premium"
            price="10 $"
            features={[
              "Unlimited private rooms",
              "Priority AI generations",
              "Team collaboration features",
              "Ad-free experience",
            ]}
            isPro={true}
            ctaText="Go Pro Now"
            ctaClass="bg-teal-400 text-gray-900 hover:bg-teal-500 shadow-xl shadow-teal-500/40"
            delay={0.2}
          />

          {/* Premium Pro */}
          <PricingCard
            title="Team"
            price="20 $"
            features={[
              "Shared team workspaces",
              "Role-based access",
              "Session recording & exports",
              "Dedicated support",
            ]}
            isPro={false}
            ctaText="Contact Sales"
            ctaClass="bg-purple-100 text-purple-700 hover:bg-purple-200"
            delay={0.4}
          />
        </motion.div>

        <motion.p
          className="text-center text-gray-400 mt-20 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Prices are billed monthly in Dollars ($).
        </motion.p>
      </div>
    </section>
  );

  // CTA Section (Repurposed for signup to emphasize rooms)
  const CTASection = () => (
    <section className="py-28 bg-indigo-600 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Ready to collaborate and ship faster?
        </motion.h2>
        <motion.p
          className="text-xl text-indigo-200 max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          Sign up, create a room, invite teammates, and start building — with AI
          help when you need it.
        </motion.p>
        <AnimatedButton
          className="bg-white text-indigo-700 hover:bg-gray-100 shadow-lg shadow-indigo-900/50"
          href="/signup"
          delay={0.4}
        >
          Create Your First Room
        </AnimatedButton>
      </div>
    </section>
  );

  // Footer Component (updated brand copy)
  const Footer = () => (
    <footer className="bg-gray-950 text-white py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-800 pb-10 mb-10">
          {/* Brand + Description */}
          <div className="space-y-4">
            <div className="text-2xl font-extrabold text-white tracking-tight flex items-center">
              <GraduationCap className="w-7 h-7 mr-2 text-teal-400" />
              CodeSense
            </div>
            <p className="text-gray-400 text-sm">
              Collaborative rooms, live Sandpack previews, and AI code help —
              built for developers and learning teams.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Rooms", path: "/room" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Support</h4>
            <ul className="space-y-3">
              {[
                { label: "Contact Us", path: "/contuct-us" },
                { label: "FAQ", path: "/FAQ" },
              ].map(({ label, path }) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {[{ label: "Privacy Policy", path: "/Privacy-Policy" }].map(
                ({ label, path }) => (
                  <li key={label}>
                    <Link
                      to={path}
                      className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
                    >
                      {label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CodeSense. All rights reserved.
        </p>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-gray-800">
      <style>{`
        @keyframes blob {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .shadow-3xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 15px rgba(79, 70, 229, 0.3); }
      `}</style>
      <Nav />
      <main>
        <HeroSection />
        <FeaturesSection />
        <VideoShowcaseSection />
        <TestimonialSection />
        {!user && <CTASection />}
      </main>
      <Footer />
    </div>
  );
};
export default HomePage;
