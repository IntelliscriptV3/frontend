import { useNavigate } from "react-router-dom";
import { RoleTile } from "@/components/RoleTile";
import adminIcon from "@/assets/admin-icon.png";

import studentIcon from "@/assets/student-icon.png";

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    { title: "Admin", icon: adminIcon, path: "/admin" },
    
    { title: "Student", icon: studentIcon, path: "/student" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex flex-col items-center justify-center p-8">
      <div className="max-w-6xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IntelliScript V3
          </h1>
          <p className="text-xl text-muted-foreground">
            Database Management System
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roles.map((role) => (
              <RoleTile
                key={role.title}
                title={role.title}
                icon={role.icon}
                onClick={() => {
                  try {
                    localStorage.setItem("user_role", role.title.toLowerCase());
                  } catch (e) {
                    // ignore localStorage errors
                  }
                  navigate(role.path);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
