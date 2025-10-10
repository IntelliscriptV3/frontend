import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TeacherAssessment = () => {
  const navigate = useNavigate();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Assessment</h1>
            <p className="text-muted-foreground mb-4">Select a subject from the Assessment section.</p>
            <Button onClick={() => navigate("/teacher/assessment")}>Go to Subjects</Button>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeacherAssessment;
