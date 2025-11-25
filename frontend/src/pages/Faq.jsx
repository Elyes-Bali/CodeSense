import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Icons from lucide-react
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import NavBar from '../components/NavBar';

/**
 * Data structure for the FAQ items, covering the core capabilities
 */
/**
 * Updated FAQ data to reflect the platform's real functionality
 */
const faqData = [
  {
    id: 1,
    question: "What is the main purpose of this platform?",
    answer:
      "Our platform allows developers, students, and tech enthusiasts to collaborate in real time by working together on interactive code rooms. Whether you're solving bugs, building a feature, studying with peers, or conducting code reviews, the platform supports live development and learning with integrated AI assistance."
  },
  {
    id: 2,
    question: "How do collaborative code rooms work?",
    answer:
      "You can create a room and invite teammates or friends to join via a unique link. Everyone in the room can view live code, propose changes, discuss in real time, and follow the editing turn system to prevent conflicts. Code is displayed via Sandpack and supports JS, React, Node, and more."
  },
  {
    id: 3,
    question: "How does the AI generate code?",
    answer:
      "Just enter a prompt describing what you want to build (e.g., 'Create a React login component' or 'Generate an Express endpoint for user signup'), and the AI will return clean, production-like code directly in the editor. You can further refine, ask for improvements, or transform the code instantly."
  },
  {
    id: 4,
    question: "Can I learn and code with friends at the same time?",
    answer:
      "Absolutely. The platform is perfect for pair programming, live debugging, coding workshops, project-based learning, and interview practice. You can even host tutoring sessions where mentors help students solve coding challenges live."
  },
  {
    id: 5,
    question: "Does the platform support version control and conflict prevention?",
    answer:
      "Yes, we use a controlled editing system. Only one person edits at a time, preventing conflicts. Others can observe and request access. We’re also integrating history tracking so you can restore previous code revisions."
  },
  {
    id: 6,
    question: "Is the AI limited to code generation?",
    answer:
      "Not at all. The AI can explain code, review logic, optimize performance, detect bugs, convert code between frameworks (e.g., from React to Vue), generate documentation, and even help with interview questions."
  },
  {
    id: 7,
    question: "Is real-time collaboration live or delayed?",
    answer:
      "The preview and AI outputs are live thanks to WebSocket communication. Changes made by users or AI are visible instantly to all connected users in the room."
  },
  {
    id: 8,
    question: "Can I use it for solo development as well?",
    answer:
      "Of course. You can use the platform individually to build features, learn new stacks, explore AI-powered solutions, prepare coding interviews, or generate full components and microservices."
  },
  {
    id: 9,
    question: "What technologies are supported in rooms?",
    answer:
      "Currently we support JavaScript, React, HTML/CSS, Node.js, Express, MongoDB, and frontend frameworks. Support for Python, Django, Java Spring Boot, and SQL sandboxes is coming soon!"
  },
  {
    id: 10,
    question: "Can I host hackathons, live sessions, or workshops on the platform?",
    answer:
      "Yes! You can create multi-user rooms to host coding events, workshops, mentorship sessions, even live interview simulations. Soon, public rooms and voice screen-sharing will also be added."
  }
];


/**
 * Individual Accordion Item component with Framer Motion animations.
 */
const AccordionItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Animation variants for the whole item (staggered initial load)
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: index * 0.08 } }
  };

  // Animation variants for the content (open/close)
  const contentVariants = {
    open: { opacity: 1, height: "auto" },
    collapsed: { opacity: 0, height: 0 }
  };

  // Dynamic classes for the button based on its state
  const buttonClasses = `flex justify-between items-center w-full text-left font-semibold py-2 transition-colors duration-200 ${
    isOpen ? 'text-purple-700 text-xl' : 'text-gray-800 text-lg'
  }`;

  // Dynamic classes for the container based on its state
  const containerClasses = `bg-white p-6 mb-4 rounded-2xl shadow-xl transition duration-300 transform hover:scale-[1.01] cursor-pointer 
    ${isOpen 
      ? 'shadow-purple-300/50 ring-4 ring-purple-300 border-purple-300' 
      : 'hover:shadow-2xl border border-indigo-100'
    }`;

  return (
    <motion.div
      layout 
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      className={containerClasses}
    >
      {/* Question Header */}
      <motion.button
        layout
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
      >
        <span className="flex items-center">
          <HelpCircle className={`w-6 h-6 mr-4 transition-colors duration-200 ${isOpen ? 'text-purple-600' : 'text-indigo-400'}`} />
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className={`w-7 h-7 transition-colors duration-200 ${isOpen ? 'text-purple-600' : 'text-indigo-400'}`} />
        </motion.div>
      </motion.button>

      {/* Answer Content - Animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={contentVariants}
            // Use a specific ease for a premium, slightly bouncier feel
            transition={{ duration: 0.4, ease: "easeInOut" }} 
            className="overflow-hidden pt-2"
          >
            <p className="pt-4 text-gray-700 border-t border-purple-200 mt-4 leading-relaxed text-base pl-10">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Faq = () => {
 return (
        <>
      <NavBar />
    <div className="min-h-screen p-4 sm:p-8 font-sans bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-12 mb-8"
        >
          <Sparkles className="w-8 h-8 mx-auto text-purple-600 mb-2 transform hover:rotate-180 transition duration-500" />
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our Focused Academic Preparation tool.
          </p>
        </motion.header>

        {/* FAQ Accordion List */}
        <motion.div
          layout
          className="space-y-4"
        >
          {faqData.map((item, index) => (
            <AccordionItem
              key={item.id}
              question={item.question}
              answer={item.answer}
              index={index}
            />
          ))}
        </motion.div>

        {/* Removed the Call to Action/Support Footer as requested */}

      </div>
    </div>
    </>
  );
};

export default Faq
