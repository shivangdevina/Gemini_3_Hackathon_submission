import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { FloatingAIButton } from "../ai/FloatingAIButton";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <FloatingAIButton />
    </div>
  );
}
