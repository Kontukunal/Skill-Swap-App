import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../contexts/ThemeContext";

const NotFoundPage = () => {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-100 dark:bg-indigo-900 opacity-40 dark:opacity-20 blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-100 dark:bg-purple-900 opacity-40 dark:opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full bg-pink-100 dark:bg-pink-900 opacity-30 dark:opacity-15 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="relative z-10 text-center glass-card p-12 rounded-3xl backdrop-blur-xl border border-white/30 dark:border-gray-700/30 shadow-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="mb-8"
        >
          <svg
            className="w-32 h-32 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="url(#paint0_linear_404)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15 9L9 15"
              stroke="url(#paint1_linear_404)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9L15 15"
              stroke="url(#paint2_linear_404)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_404"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_404"
                x1="9"
                y1="9"
                x2="15"
                y2="15"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EC4899" />
                <stop offset="1" stopColor="#F43F5E" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_404"
                x1="9"
                y1="9"
                x2="15"
                y2="15"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#EC4899" />
                <stop offset="1" stopColor="#F43F5E" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Lost in the <span className="text-indigo-500">Digital Void</span>
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
          The page you're seeking has either vanished into the ether or never
          existed in this dimension.
        </p>
        <Link
          to="/"
          className="px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            ></path>
          </svg>
          Beam Me Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
