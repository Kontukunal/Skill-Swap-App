import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RiExchangeBoxLine } from "react-icons/ri";
import { BsPersonVideo } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { TiHome } from "react-icons/ti";
import { SiGoogledocs } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";
import { useTheme } from "../../contexts/ThemeContext";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme } = useTheme();
  const location = useLocation();
  const navItems = [
    { name: "Home", path: "/", icon: TiHome },
    { name: "Exchange", path: "/exchange", icon: RiExchangeBoxLine },
    { name: "Sessions", path: "/sessions", icon: BsPersonVideo },
    { name: "Community", path: "/community", icon: IoIosPeople },
    { name: "Resources", path: "/resources", icon: SiGoogledocs },
    { name: "Profile", path: "/profile", icon: IoSettingsSharp },
  ];

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-40 w-64 transform transition-all duration-300 ease-in-out md:hidden`}
        style={{
          background:
            theme.mode === "dark"
              ? "rgba(31, 41, 55, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRight:
            theme.mode === "dark"
              ? "1px solid rgba(55, 65, 81, 0.5)"
              : "1px solid rgba(229, 231, 235, 0.5)",
        }}
      >
        <div
          className={`flex items-center justify-between h-16 px-4 ${theme.mode === "dark" ? "border-gray-700" : "border-gray-200"} border-b`}
        >
          <span
            className={`text-xl font-bold ${theme.mode === "dark" ? "text-white" : "text-gray-800"}`}
          >
            SkillSwap
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`p-1 rounded-md ${theme.mode === "dark" ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-600"} focus:outline-none transition-colors duration-200`}
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
        <nav className="mt-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                location.pathname === item.path
                  ? theme.mode === "dark"
                    ? "bg-gray-700 text-indigo-400"
                    : "bg-indigo-50 text-indigo-600"
                  : theme.mode === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div
          className="flex flex-col w-64 transition-colors duration-300"
          style={{
            background:
              theme.mode === "dark"
                ? "rgba(31, 41, 55, 0.95)"
                : "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            borderRight:
              theme.mode === "dark"
                ? "1px solid rgba(55, 65, 81, 0.5)"
                : "1px solid rgba(229, 231, 235, 0.5)",
          }}
        >
          <div
            className={`flex items-center h-16 px-4 ${theme.mode === "dark" ? "border-gray-700" : "border-gray-200"} border-b`}
          >
            <span
              className={`text-xl font-bold ${theme.mode === "dark" ? "text-white" : "text-gray-800"}`}
            >
              SkillSwap
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? theme.mode === "dark"
                      ? "bg-gray-700 text-indigo-400"
                      : "bg-indigo-50 text-indigo-600"
                    : theme.mode === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
