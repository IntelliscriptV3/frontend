import { ChatInterface } from "@/components/ChatInterface";
import { SidebarProvider } from "@/components/ui/sidebar";
import { InstructorSidebar } from "./InstructorSidebar";

const InstructorChat = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <InstructorSidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default InstructorChat;
