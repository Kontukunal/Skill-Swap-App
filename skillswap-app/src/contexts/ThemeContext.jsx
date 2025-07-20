// // contexts/ThemeContext.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     // Check for saved theme preference or use system preference
//     const savedTheme = localStorage.getItem("theme");
//     const isDark = savedTheme
//       ? savedTheme === "dark"
//       : window.matchMedia("(prefers-color-scheme: dark)").matches;

//     setDarkMode(isDark);
//   }, []);

//   useEffect(() => {
//     // Apply theme changes
//     document.documentElement.setAttribute(
//       "data-theme",
//       darkMode ? "dark" : "light"
//     );
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [darkMode]);

//   const toggleTheme = () => setDarkMode(!darkMode);

//   return (
//     <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

// src/contexts/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const lightTheme = {
  mode: "light",
  primary: "#6366f1",
  secondary: "#8b5cf6",
  background: "#f9fafb",
  card: "#ffffff",
  text: "#111827",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  glass: "rgba(255, 255, 255, 0.25)",
  glassBorder: "rgba(255, 255, 255, 0.18)",
};

export const darkTheme = {
  mode: "dark",
  primary: "#818cf8",
  secondary: "#a78bfa",
  background: "#111827",
  card: "#1f2937",
  text: "#f9fafb",
  textSecondary: "#9ca3af",
  border: "#374151",
  glass: "rgba(31, 41, 55, 0.25)",
  glassBorder: "rgba(31, 41, 55, 0.18)",
};

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.mode === "light" ? darkTheme : lightTheme
    );
    localStorage.setItem("theme", theme.mode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme === "dark" ? darkTheme : lightTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
