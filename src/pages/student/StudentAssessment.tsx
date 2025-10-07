import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";

const StudentAssessment = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Assessment</h1>
            <p className="text-muted-foreground">This page is under construction.</p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentAssessment;
