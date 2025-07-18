import React from "react";

const LoadingSpinner = ({ size = "medium" }) => {
  const sizes = {
    small: "h-6 w-6",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-t-2 border-b-2 border-indigo-500`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
