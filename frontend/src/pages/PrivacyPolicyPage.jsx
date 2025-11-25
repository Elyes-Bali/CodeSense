import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, UserCheck } from 'lucide-react';
import NavBar from '../components/NavBar';

// The content of the Privacy Policy document is placed directly into a constant for rendering.
// 🔹 Updated page content
const PRIVACY_POLICY_CONTENT = {
  title: "Privacy Policy",
  lastUpdated: "November 24, 2025",
  sections: [
    {
      id: "info-collect",
      icon: FileText,
      title: "1. Information We Collect",
      items: [
        {
          title: "1.1 Information You Provide",
          text: "When you register, we collect your email address, hashed password, and display name. Inside collaborative rooms, we collect the code you write, messages you send, AI prompts, and any additional resources you upload (e.g., code snippets, documentation). This information is processed solely to enable real-time collaboration and AI-generated assistance.",
          color: "text-blue-500"
        },
        {
          title: "1.2 Activity & Technical Information",
          text: "We automatically collect usage data such as room participation, AI interactions, and collaboration activity logs. Technical data (e.g., IP address, device type, browser version) may also be collected to ensure platform functionality and security.",
          color: "text-blue-500"
        }
      ]
    },
    {
      id: "info-use",
      icon: UserCheck,
      title: "2. How We Use Your Information",
      items: [
        {
          title: "To Enable Collaborative Development",
          text: "We process user content and room interactions to allow multiple users to work together seamlessly in real time using shared code editors and Sandpack.",
          color: "text-green-500"
        },
        {
          title: "AI Assistance & Code Generation",
          text: "Your prompts and code inputs are used only to generate relevant AI suggestions or code output. These are *not reused or stored for training* without anonymization.",
          color: "text-green-500"
        },
        {
          title: "Platform Optimization & Diagnostics",
          text: "We analyze performance, usage patterns, and error reports to improve features such as syncing, AI accuracy, and editor stability.",
          color: "text-green-500"
        }
      ]
    },
    {
      id: "data-processing",
      icon: Shield,
      title: "3. Data Processing & Code Privacy",
      items: [
        {
          title: "Confidentiality of Code & Prompts",
          text: "Your code, room messages, and AI prompts are *not shared with or sold to third parties*. Processing is limited to providing real-time collaboration and AI functionality.",
          color: "text-purple-500"
        },
        {
          title: "AI Training (Optional)",
          text: "We may use anonymized usage insights to improve the AI model, but we will never use full code, personal projects, or room conversations unless explicitly permitted.",
          color: "text-purple-500"
        }
      ]
    },
    {
      id: "data-sharing",
      icon: Lock,
      title: "4. Security, Sharing & Compliance",
      items: [
        {
          title: "Secure Infrastructure",
          text: "We rely on encrypted databases and secure backend services to store user credentials and room content.",
          color: "text-red-500"
        },
        {
          title: "Legal Requirements",
          text: "We may disclose information only when legally required, such as in case of court order or cyber security investigation.",
          color: "text-red-500"
        },
        {
          title: "Business Acquisition",
          text: "In case of platform acquisition or transition, data may be transferred under equivalent security standards.",
          color: "text-red-500"
        }
      ]
    },
    {
      id: "retention-rights",
      icon: Lock,
      title: "5. Data Security, Retention, and Your Rights",
      items: [
        {
          title: "Data Retention & Protection",
          text: "We store your data securely only as long as necessary to provide you with the collaboration services. You can request data deletion at any time.",
          color: "text-yellow-500"
        },
        {
          title: "Your Rights",
          text: "You may request access, correction, or deletion of your account data. Updates to this policy will be reflected in the ‘Last Updated’ section.",
          color: "text-yellow-500"
        }
      ]
    }
  ]
};


/**
 * Renders the content of a single section.
 */
const PolicySection = ({ section, index }) => {
  const SectionIcon = section.icon;

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 + index * 0.1 } }
  };

  return (
    <motion.div
      variants={sectionVariants}
      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="flex items-center mb-6">
        <SectionIcon className="w-8 h-8 text-purple-600 mr-4" />
        <h2 className="text-2xl font-bold text-gray-800">{section.title}</h2>
      </div>
      
      <div className="space-y-6 border-l-4 border-purple-200 pl-6">
        {section.items.map((item, itemIndex) => (
          <motion.div
            key={itemIndex}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + itemIndex * 0.05 }}
            className="relative"
          >
            {/* Visual indicator dot */}
            <div className={`absolute -left-9 top-1 w-4 h-4 rounded-full ${item.color.replace('text-', 'bg-')} ring-4 ring-white`}></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
            <p className="text-gray-600 leading-relaxed text-base">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const PrivacyPolicyPage = () => {
  return (
    <>
        <NavBar />
   
    <div className="min-h-screen p-4 sm:p-10 font-sans bg-gray-50">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-16 mb-12 bg-white rounded-xl shadow-xl border-t-4 border-purple-600"
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
            {PRIVACY_POLICY_CONTENT.title}
          </h1>
          <p className="text-md text-gray-500 font-medium">
            Last Updated: {PRIVACY_POLICY_CONTENT.lastUpdated}
          </p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-gray-700 max-w-3xl mx-auto px-4"
          >
            This policy explains how we handle code collaboration data, AI generation requests, and user interactions within development rooms. Your code privacy and AI interaction confidentiality are our highest priority.

          </motion.p>
        </motion.header>

        {/* Policy Sections */}
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {PRIVACY_POLICY_CONTENT.sections.map((section, index) => (
            <PolicySection 
              key={section.id} 
              section={section} 
              index={index} 
            />
          ))}
        </motion.div>

        <footer className="text-center mt-16 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} CodeSense. All rights reserved.
        </footer>
      </div>
    </div>
     </>
  );
}

export default PrivacyPolicyPage
