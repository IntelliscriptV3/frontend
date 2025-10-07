import { ChatInterface } from "@/components/ChatInterface";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";

const TeacherChat = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeacherChat;
