import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AIProvider } from "@/contexts/AIContext";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import CreateTeam from "./pages/CreateTeam";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import Workspace from "./pages/Workspace";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { LoadingProvider } from "@/contexts/LoadingContext";
import GlobalLoader from "@/components/GlobalLoader";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AIProvider>
        <AuthProvider>
        <LoadingProvider>
        <Toaster />
        <Sonner />
        <GlobalLoader />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<PublicRoute><SignUp/></PublicRoute>}/>
            <Route path="/signin" element={<PublicRoute><SignIn/></PublicRoute>}/>
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/create-team" element={<ProtectedRoute><CreateTeam /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/workspace" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </LoadingProvider>
        </AuthProvider>
      </AIProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
