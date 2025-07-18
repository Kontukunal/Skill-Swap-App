import React from "react";
import { Toaster } from "react-hot-toast";

const ToastNotification = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: "",
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        success: {
          style: {
            background: "#4BB543",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#FF3333",
            color: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastNotification;
