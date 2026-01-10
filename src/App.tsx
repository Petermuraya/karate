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
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminClasses from "./pages/admin/AdminClasses";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminReports from "./pages/admin/AdminReports";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter basename="/karate">
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
            <Route path="/instructor/videos" element={<InstructorManageVideos />} />
            <Route path="/instructor/classes" element={<InstructorManageClasses />} />
            <Route path="/instructor/profile" element={<InstructorProfileEdit />} />
            <Route path="/onboarding" element={<StudentOnboarding />} />
            <Route path="/admin" element={<Navigate to="/instructor" replace />} />
            <Route path="/admin/classes" element={<Navigate to="/instructor/classes" replace />} />
            <Route path="/admin/users" element={<Navigate to="/instructor/users" replace />} />
            <Route path="/admin/notifications" element={<Navigate to="/instructor" replace />} />
            <Route path="/admin/gallery" element={<Navigate to="/instructor" replace />} />
            <Route path="/admin/reports" element={<Navigate to="/instructor" replace />} />
            <Route path="/admin/settings" element={<Navigate to="/instructor/profile" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
