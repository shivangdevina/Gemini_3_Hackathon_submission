import { createContext, useContext, useState, ReactNode , useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  role: string | null;
  signIn: (userId: string, email: string, role: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  // Restore session on refresh
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    const storedEmail = localStorage.getItem("email");
    const storedRole = localStorage.getItem("role");
    
    if (storedUserId && storedEmail && storedRole) {
      setUserId(storedUserId);
      setEmail(storedEmail);
      setRole(storedRole);
      setIsAuthenticated(true);
    }
  }, []);

  const signIn = (id: string, userEmail: string, userRole: string) => {
    localStorage.setItem("user_id", id);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("role", userRole);
    setUserId(id);
    setEmail(userEmail);
    setRole(userRole);
    setIsAuthenticated(true);
  };

  const signOut = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setUserId(null);
    setEmail(null);
    setRole(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, email, role, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}