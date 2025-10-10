import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const dummyCourses = [
  { id: "CS101", name: "Introduction to Computer Science", grade: "10", stream: "Science" },
  { id: "MATH201", name: "Advanced Mathematics", grade: "11", stream: "Science" },
  { id: "PHY301", name: "Physics Fundamentals", grade: "10", stream: "Science" },
  { id: "ENG101", name: "English Literature", grade: "10", stream: "Arts" },
];

const StudentAssessment = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dummyCourses.map((course) => (
                <Card
                  key={course.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/student/course/${course.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{course.id}</CardTitle>
                    </div>
                    <CardDescription className="text-base font-medium text-foreground">
                      {course.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Grade: {course.grade}</span>
                      <span>Stream: {course.stream}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentAssessment;
