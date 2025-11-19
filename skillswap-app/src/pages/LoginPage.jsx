import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import AuthIllustration from "../assets/auth.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success("Logged in successfully!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log in: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${theme.mode === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-indigo-50 to-gray-50"} py-12 px-4 sm:px-6 lg:px-8`}
    >
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex items-center justify-center relative"
        >
          <div className="absolute top-0 left-0 w-full h-full">
            {theme.mode === "dark" ? (
              <>
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-900 opacity-20 blur-3xl animate-blob"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-900 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
              </>
            ) : (
              <>
                <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-100 opacity-40 blur-3xl animate-blob"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-100 opacity-40 blur-3xl animate-blob animation-delay-2000"></div>
              </>
            )}
          </div>
          <img
            src={AuthIllustration}
            alt="Authentication illustration"
            className="w-full h-auto max-w-lg relative z-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`max-w-md w-full mx-auto p-8 rounded-2xl ${theme.mode === "dark" ? "bg-gray-800/80 backdrop-blur-md border border-gray-700" : "bg-white/80 backdrop-blur-md border border-gray-200"} shadow-xl flex flex-col justify-center`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className={`font-medium ${theme.mode === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"} transition-colors`}
              >
                Sign up
              </Link>
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`block w-full px-4 py-3 rounded-lg ${theme.mode === "dark" ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"} border focus:outline-none focus:ring-2 focus:z-10 sm:text-sm`}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${theme.mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`block w-full px-4 py-3 rounded-lg ${theme.mode === "dark" ? "bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500"} border focus:outline-none focus:ring-2 focus:z-10 sm:text-sm`}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <div
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none ${theme.mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 rounded ${theme.mode === "dark" ? "bg-gray-700 border-gray-600 text-indigo-500 focus:ring-indigo-500" : "bg-white border-gray-300 text-indigo-600 focus:ring-indigo-500"} border focus:ring-2`}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className={`font-medium ${theme.mode === "dark" ? "text-indigo-400 hover:text-indigo-300" : "text-indigo-600 hover:text-indigo-500"} transition-colors`}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg ${theme.mode === "dark" ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700" : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"} text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.mode === "dark" ? "focus:ring-indigo-500" : "focus:ring-indigo-500"} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className={`h-5 w-5 ${theme.mode === "dark" ? "text-indigo-400 group-hover:text-indigo-300" : "text-indigo-200 group-hover:text-indigo-100"} transition-colors`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
