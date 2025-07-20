import React from "react";
import { Link, useLocation } from "react-router-dom";
import { RiExchangeBoxLine } from "react-icons/ri";
import { BsPersonVideo } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { TiHome } from "react-icons/ti";
import { SiGoogledocs } from "react-icons/si";
import { IoSettingsSharp } from "react-icons/io5";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
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
        } fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out md:hidden`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            SkillSwap
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
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
              className={`flex items-center px-4 py-3 text-sm font-medium ${
                location.pathname === item.path
                  ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
        <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <span className="text-xl font-bold text-gray-800 dark:text-white">
              SkillSwap
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium ${
                  location.pathname === item.path
                    ? "bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
