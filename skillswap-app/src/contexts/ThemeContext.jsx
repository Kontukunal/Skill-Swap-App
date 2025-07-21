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
  theme: darkTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.mode === "light" ? darkTheme : lightTheme
    );
    localStorage.setItem("theme", theme.mode === "light" ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const initialTheme = savedTheme === "light" ? lightTheme : darkTheme;
    setTheme(initialTheme);
    document.documentElement.classList.toggle(
      "dark",
      initialTheme.mode === "dark"
    );
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
