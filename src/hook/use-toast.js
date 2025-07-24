
import * as React from "react";
import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  
  const toast = ({ title, description, variant = "default" }) => {
    const id = new Date().getTime().toString();
    setToasts((prev) => [
      ...prev,
      { id, title, description, variant },
    ]);

    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  return { toasts, toast };
}
