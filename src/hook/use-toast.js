// src/hooks/use-toast.js
import * as React from "react";
import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  // Add toast function
  const toast = ({ title, description, variant = "default" }) => {
    const id = new Date().getTime().toString();
    setToasts((prev) => [
      ...prev,
      { id, title, description, variant },
    ]);

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return { toasts, toast };
}
