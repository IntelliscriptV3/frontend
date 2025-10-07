import { Home, Settings, ListOrdered, Users, GraduationCap, User, DollarSign, Calendar } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Settings", icon: Settings, path: "/admin/settings" },
  { title: "Admin Queue", icon: ListOrdered, path: "/admin/queue" },
  { title: "Management", icon: Users, path: "/admin/management" },
  { title: "Student", icon: GraduationCap, path: "/admin/student" },
  { title: "Teacher", icon: User, path: "/admin/teacher" },
  { title: "Student Fee", icon: DollarSign, path: "/admin/fee" },
  { title: "Attendance", icon: Calendar, path: "/admin/attendance" },
];

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
          <Home className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Admin Panel</span>
        </div>
        <SidebarTrigger />
      </div>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className={isActive ? "bg-primary/10 text-primary font-medium" : ""}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
