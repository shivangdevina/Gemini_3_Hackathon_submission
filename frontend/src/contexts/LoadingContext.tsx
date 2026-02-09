import React, { createContext, useContext, useState, ReactNode, useRef } from "react";

interface LoadingContextType {
  isLoading: boolean;
  message: string | null;
  show: (message?: string) => void;
  hide: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const counter = useRef(0);

  const show = (msg?: string) => {
    counter.current += 1;
    setMessage(msg || "Working on it — this may take a few moments...");
    setIsLoading(true);
  };

  const hide = () => {
    counter.current = Math.max(0, counter.current - 1);
    if (counter.current === 0) {
      setIsLoading(false);
      setMessage(null);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, message, show, hide }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}
