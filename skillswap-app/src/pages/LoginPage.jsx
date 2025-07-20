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
        {/* Illustration Section */}
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

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`max-w-md w-full mx-auto p-8 rounded-2xl ${theme.mode === "dark" ? "bg-gray-800/80 backdrop-blur-md border border-gray-700" : "bg-white/80 backdrop-blur-md border border-gray-200"} shadow-xl`}
        >
          <div className="text-center">
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

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${theme.mode === "dark" ? "border-gray-700" : "border-gray-300"}`}
                ></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span
                  className={`px-2 ${theme.mode === "dark" ? "bg-gray-800 text-gray-400" : "bg-white text-gray-500"}`}
                >
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium ${theme.mode === "dark" ? "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"} focus:outline-none focus:ring-2 ${theme.mode === "dark" ? "focus:ring-indigo-500" : "focus:ring-indigo-500"} focus:ring-offset-2 transition-colors`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.477 0 10c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0110 4.844c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C17.14 18.163 20 14.418 20 10c0-5.523-4.477-10-10-10z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={`w-full inline-flex justify-center py-2 px-4 border rounded-lg shadow-sm text-sm font-medium ${theme.mode === "dark" ? "bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-700" : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"} focus:outline-none focus:ring-2 ${theme.mode === "dark" ? "focus:ring-indigo-500" : "focus:ring-indigo-500"} focus:ring-offset-2 transition-colors`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
