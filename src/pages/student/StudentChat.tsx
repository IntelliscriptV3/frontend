import { ChatInterface } from "@/components/ChatInterface";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";

const StudentChat = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentChat;
