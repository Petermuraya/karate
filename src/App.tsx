import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VideoLibrary from "./pages/VideoLibrary";
import InstructorPanel from "./pages/InstructorPanel";
import InstructorVideoUpload from "./pages/InstructorVideoUpload";
import InstructorManageUsers from "./pages/InstructorManageUsers";
import InstructorManageClasses from "./pages/InstructorManageClasses";
import InstructorManageVideos from "./pages/InstructorManageVideos";
import InstructorProfileEdit from "./pages/InstructorProfileEdit";
import StudentOnboarding from "./pages/StudentOnboarding";
import StudentProfileEdit from "./pages/StudentProfileEdit";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter basename="/karate">
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Student Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videos" element={<VideoLibrary />} />
            <Route path="/onboarding" element={<StudentOnboarding />} />
            <Route path="/profile" element={<StudentProfileEdit />} />
            
            {/* Instructor Routes (Unified Dashboard) */}
            <Route path="/instructor" element={<InstructorPanel />} />
            <Route path="/instructor/upload" element={<InstructorVideoUpload />} />
            <Route path="/instructor/users" element={<InstructorManageUsers />} />
            <Route path="/instructor/videos" element={<InstructorManageVideos />} />
            <Route path="/instructor/classes" element={<InstructorManageClasses />} />
            <Route path="/instructor/profile" element={<InstructorProfileEdit />} />
            
            {/* Legacy admin routes redirect to instructor */}
            <Route path="/admin" element={<Navigate to="/instructor" replace />} />
            <Route path="/admin/*" element={<Navigate to="/instructor" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;