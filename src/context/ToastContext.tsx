import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import Toast, { type ToastType } from "../componets/ui/Toast";

type ToastContextType = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (msg: string, toastType: ToastType = "info") => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      setType(toastType);
      setVisible(true);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 4000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={message} type={type} visible={visible} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}
