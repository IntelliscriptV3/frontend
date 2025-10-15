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
import StudentEnrollment from "./pages/admin/StudentEnrollment";
import TeacherCourses from "./pages/admin/TeacherCourses";
import Teacher from "./pages/admin/Teacher";
import Teachers from "./pages/admin/Teachers";
import Courses from "./pages/admin/Courses";
import StudentFee from "./pages/admin/StudentFee";
import Attendance from "./pages/admin/Attendance";
import Uploads from "./pages/admin/Uploads";

// Teacher pages
import TeacherChat from "./pages/teacher/TeacherChat";
import CreatingInstructor from "./pages/teacher/CreatingInstructor";
import TeacherAssessment from "./pages/teacher/TeacherAssessment";
import AssessmentSubjects from "./pages/teacher/AssessmentSubjects";
import CourseAssessments from "./pages/teacher/CourseAssessments";
import AssessmentResults from "./pages/teacher/AssessmentResults";

// Instructor pages
import InstructorChat from "./pages/instructor/InstructorChat";
import InstructorAssessment from "./pages/instructor/InstructorAssessment";
import InstructorSubjects from "./pages/instructor/InstructorSubjects";
import InstructorCourseAssessments from "./pages/instructor/InstructorCourseAssessments";
import InstructorAssessmentResults from "./pages/instructor/InstructorAssessmentResults";

// Student pages
import StudentChat from "./pages/student/StudentChat";
import StudentAssessment from "./pages/student/StudentAssessment";
import StudentCourse from "./pages/student/StudentCourse";

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
          <Route path="/admin/student/:studentId/enroll" element={<StudentEnrollment />} />
          <Route path="/admin/teacher/:teacherId/courses" element={<TeacherCourses />} />
          <Route path="/admin/teacher" element={<Teacher />} />
          <Route path="/admin/teacher/teachers" element={<Teachers />} />
          <Route path="/admin/teacher/courses" element={<Courses />} />
          <Route path="/admin/uploads" element={<Uploads />} />
          <Route path="/admin/fee" element={<StudentFee />} />
          <Route path="/admin/attendance" element={<Attendance />} />
          
          {/* Teacher routes */}
          <Route path="/teacher" element={<TeacherChat />} />
          <Route path="/teacher/create-instructor" element={<CreatingInstructor />} />
          <Route path="/teacher/assessment" element={<AssessmentSubjects />} />
          <Route path="/teacher/assessment/:courseId" element={<CourseAssessments />} />
          <Route path="/teacher/assessment/:courseId/:assessmentId/results" element={<AssessmentResults />} />
          
          {/* Instructor routes */}
          <Route path="/instructor" element={<InstructorChat />} />
          <Route path="/instructor/assessment" element={<InstructorSubjects />} />
          <Route path="/instructor/assessment/:courseId" element={<InstructorCourseAssessments />} />
          <Route path="/instructor/assessment/:courseId/:assessmentId/results" element={<InstructorAssessmentResults />} />
          
          {/* Student routes */}
          <Route path="/student" element={<StudentChat />} />
          <Route path="/student/assessment" element={<StudentAssessment />} />
          <Route path="/student/course/:courseId" element={<StudentCourse />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
