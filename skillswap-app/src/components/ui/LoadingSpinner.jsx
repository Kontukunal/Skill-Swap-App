import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

const LoadingSpinner = ({ size = "medium" }) => {
  const { theme } = useTheme();
  const sizes = {
    small: "h-6 w-6 border-2",
    medium: "h-8 w-8 border-[3px]",
    large: "h-12 w-12 border-4",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-t-transparent ${theme.mode === "dark" ? "border-indigo-400" : "border-indigo-600"}`}
        style={{
          animationTimingFunction: "cubic-bezier(0.65, 0.05, 0.36, 1)",
        }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
