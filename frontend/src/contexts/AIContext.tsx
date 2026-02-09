import { createContext, useContext, useState, ReactNode } from "react";

interface AIContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openWithMessage?: string;
  setOpenWithMessage: (message: string | undefined) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openWithMessage, setOpenWithMessage] = useState<string | undefined>();

  return (
    <AIContext.Provider value={{ isOpen, setIsOpen, openWithMessage, setOpenWithMessage }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
}
