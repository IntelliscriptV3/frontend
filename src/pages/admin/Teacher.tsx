import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";

const Teacher = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Teacher</h1>
            <p className="text-muted-foreground">This page is under construction.</p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Teacher;
