import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { GraduationCap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Teacher = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Teacher Management</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => navigate("/admin/teacher/teachers")}
                className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 cursor-pointer hover:border-primary transition-all hover:scale-105"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Teachers</h2>
                  <p className="text-muted-foreground">Manage teacher records</p>
                </div>
              </div>

              <div
                onClick={() => navigate("/admin/teacher/courses")}
                className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 cursor-pointer hover:border-primary transition-all hover:scale-105"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold">Courses</h2>
                  <p className="text-muted-foreground">Manage courses and assessments</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Teacher;
