import React, { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Menu, Transition } from "@headlessui/react";
import { FiMenu, FiUser, FiLogOut, FiSun, FiMoon } from "react-icons/fi";
import Logo from "../../assets/logo.svg";
import NotificationBell from "../notifications/NotificationBell"; 

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showMenuButton, setShowMenuButton] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isMobile = window.innerWidth <= 768;
      setShowMenuButton(currentUser && isMobile && !sidebarOpen);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [currentUser, sidebarOpen]);

  return (
    <header
      className={`sticky top-0 z-50 ${theme.mode === "dark" ? "bg-gray-800/80 border-b border-gray-700" : "bg-white/80 border-b border-gray-200"} backdrop-blur-md transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left section */}
          <div className="flex items-center">
            {showMenuButton && (
              <button
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md ${theme.mode === "dark" ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:text-gray-600 hover:bg-gray-100"} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mr-2 transition-colors duration-200`}
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <FiMenu className="h-6 w-6" />
              </button>
            )}

            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
            >
              <img className="h-8 w-auto" src={Logo} alt="SkillSwap" />
              <span
                className={`ml-2 text-xl font-bold ${theme.mode === "dark" ? "text-white" : "text-gray-800"}`}
              >
                SkillSwap
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme.mode === "dark" ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700" : "text-gray-500 hover:text-gray-600 hover:bg-gray-100"} transition-colors duration-200`}
              aria-label={
                theme.mode === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme.mode === "dark" ? (
                <FiSun className="h-5 w-5" />
              ) : (
                <FiMoon className="h-5 w-5" />
              )}
            </button>

            {currentUser && <NotificationBell theme={theme} />}

            {currentUser ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium shadow-md">
                    {currentUser.displayName
                      ? currentUser.displayName.charAt(0).toUpperCase()
                      : currentUser.email.charAt(0).toUpperCase()}
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    className={`origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${theme.mode === "dark" ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"} ring-1 ring-black ring-opacity-5 focus:outline-none z-50`}
                  >
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                            active
                              ? theme.mode === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-100"
                              : ""
                          } ${theme.mode === "dark" ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <div className="flex items-center">
                            <FiUser className="mr-2" />
                            My Profile
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={logout}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                            active
                              ? theme.mode === "dark"
                                ? "bg-gray-700"
                                : "bg-gray-100"
                              : ""
                          } ${theme.mode === "dark" ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <div className="flex items-center">
                            <FiLogOut className="mr-2" />
                            Sign out
                          </div>
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium ${theme.mode === "dark" ? "text-gray-300 hover:text-indigo-400" : "text-gray-700 hover:text-indigo-600"} transition-colors duration-200`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
