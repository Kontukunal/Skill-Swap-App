import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RiExchangeBoxLine } from "react-icons/ri";
import { BsPersonVideo, BsRocketTakeoff } from "react-icons/bs";
import { IoIosPeople, IoMdAnalytics } from "react-icons/io";
import { TiHome } from "react-icons/ti";
import { SiGoogledocs } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";
import { useTheme } from "../../contexts/ThemeContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: TiHome },
    { name: "Skill Exchange", path: "/exchange", icon: RiExchangeBoxLine },
    { name: "Learning Hub", path: "/sessions", icon: BsPersonVideo },
    { name: "Community", path: "/community", icon: IoIosPeople },
    { name: "Resources", path: "/resources", icon: SiGoogledocs },
    { name: "Profile", path: "/profile", icon: IoSettingsSharp },
  ];

  const sidebarStyle = {
    background:
      theme.mode === "dark"
        ? "linear-gradient(160deg, rgba(31,41,55,0.95) 0%, rgba(17,24,39,0.95) 100%)"
        : "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(245,243,255,0.95) 100%)",
    backdropFilter: "blur(12px)",
    boxShadow:
      theme.mode === "dark"
        ? "0 0 20px rgba(79, 70, 229, 0.15)"
        : "0 0 20px rgba(99, 102, 241, 0.1)",
    borderRight:
      theme.mode === "dark"
        ? "1px solid rgba(55, 65, 81, 0.3)"
        : "1px solid rgba(229, 231, 235, 0.5)",
  };

  return (
    <>
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-72 transform transition-all duration-300 ease-in-out md:hidden`}
        style={sidebarStyle}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/20">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
            SkillSwap
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-1.5 rounded-lg ${theme.mode === "dark" ? "text-gray-400 hover:bg-gray-700/50" : "text-gray-500 hover:bg-gray-100/50"} transition-all duration-200`}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3.5 mb-1 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? theme.mode === "dark"
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-400/30 shadow-md"
                      : "bg-indigo-500/10 text-indigo-600 border border-indigo-400/30 shadow-md"
                    : theme.mode === "dark"
                      ? "text-gray-300 hover:bg-gray-700/30 hover:text-indigo-300"
                      : "text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-500"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? "opacity-100" : "opacity-70"}`}
                />
                {item.name}
                {isActive && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:flex md:flex-shrink-0">
        <div
          className="flex flex-col w-72 h-screen sticky top-0 overflow-hidden"
          style={sidebarStyle}
        >
          <div className="flex items-center h-16 px-6 border-b border-gray-200/20">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              SkillSwap
            </span>
          </div>
          <nav className="flex-1 px-3 py-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-4 py-3.5 mb-1 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? theme.mode === "dark"
                        ? "bg-indigo-600/20 text-indigo-400 border border-indigo-400/30 shadow-md"
                        : "bg-indigo-500/10 text-indigo-600 border border-indigo-400/30 shadow-md"
                      : theme.mode === "dark"
                        ? "text-gray-300 hover:bg-gray-700/30 hover:text-indigo-300"
                        : "text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-500"
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${isActive ? "opacity-100" : "opacity-70"}`}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </nav>
          <div
            className={`px-4 py-4 border-t ${theme.mode === "dark" ? "border-gray-700/50" : "border-gray-200/50"}`}
          >
            <div
              className={`text-xs font-medium ${theme.mode === "dark" ? "text-gray-400" : "text-gray-500"}`}
            >
              By Kunal Mali
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
