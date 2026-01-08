import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VideoLibrary from "./pages/VideoLibrary";
import InstructorPanel from "./pages/InstructorPanel";
import InstructorVideoUpload from "./pages/InstructorVideoUpload";
import InstructorManageUsers from "./pages/InstructorManageUsers";
import InstructorManageClasses from "./pages/InstructorManageClasses";
import InstructorProfileEdit from "./pages/InstructorProfileEdit";
import StudentOnboarding from "./pages/StudentOnboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videos" element={<VideoLibrary />} />
            <Route path="/instructor" element={<InstructorPanel />} />
            <Route path="/instructor/upload" element={<InstructorVideoUpload />} />
            <Route path="/instructor/users" element={<InstructorManageUsers />} />
            <Route path="/instructor/classes" element={<InstructorManageClasses />} />
            <Route path="/instructor/profile" element={<InstructorProfileEdit />} />
            <Route path="/onboarding" element={<StudentOnboarding />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
