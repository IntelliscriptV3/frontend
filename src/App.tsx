import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminChat from "./pages/admin/AdminChat";
import Settings from "./pages/admin/Settings";
import AdminQueue from "./pages/admin/AdminQueue";
import Management from "./pages/admin/Management";
import Student from "./pages/admin/Student";
import Teacher from "./pages/admin/Teacher";
import Teachers from "./pages/admin/Teachers";
import Courses from "./pages/admin/Courses";
import StudentFee from "./pages/admin/StudentFee";
import Attendance from "./pages/admin/Attendance";

// Teacher pages
import TeacherChat from "./pages/teacher/TeacherChat";
import CreatingInstructor from "./pages/teacher/CreatingInstructor";
import TeacherAssessment from "./pages/teacher/TeacherAssessment";

// Instructor pages
import InstructorChat from "./pages/instructor/InstructorChat";
import InstructorAssessment from "./pages/instructor/InstructorAssessment";

// Student pages
import StudentChat from "./pages/student/StudentChat";
import StudentAssessment from "./pages/student/StudentAssessment";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminChat />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/queue" element={<AdminQueue />} />
          <Route path="/admin/management" element={<Management />} />
          <Route path="/admin/student" element={<Student />} />
          <Route path="/admin/teacher" element={<Teacher />} />
          <Route path="/admin/fee" element={<StudentFee />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          
          {/* Teacher routes */}
          <Route path="/teacher" element={<TeacherChat />} />
          <Route path="/teacher/create-instructor" element={<CreatingInstructor />} />
          <Route path="/teacher/assessment" element={<TeacherAssessment />} />
          
          {/* Instructor routes */}
          <Route path="/instructor" element={<InstructorChat />} />
          <Route path="/instructor/assessment" element={<InstructorAssessment />} />
          
          {/* Student routes */}
          <Route path="/student" element={<StudentChat />} />
          <Route path="/student/assessment" element={<StudentAssessment />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
