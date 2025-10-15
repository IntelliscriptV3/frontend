import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Course = {
  course_id: string;
  course_code: string;
  subject: string;
  grade: string;
  stream: string;
  teacher_id: string;
};

// Dummy data for available courses
const dummyCourses: Course[] = [
  {
    course_id: "C001",
    course_code: "MATH101",
    subject: "Mathematics",
    grade: "10",
    stream: "Science",
    teacher_id: "T001",
  },
  {
    course_id: "C002",
    course_code: "ENG101",
    subject: "English",
    grade: "10",
    stream: "Arts",
    teacher_id: "T002",
  },
  {
    course_id: "C003",
    course_code: "SCI101",
    subject: "Science",
    grade: "10",
    stream: "Science",
    teacher_id: "T003",
  },
];

const StudentEnrollment = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses] = useState<Course[]>(dummyCourses);
  const [filters, setFilters] = useState({
    course_id: "",
    course_code: "",
    subject: "",
    grade: "",
    stream: "",
    teacher_id: "",
  });

  const handleEnroll = (courseId: string) => {
    // Here you would typically make an API call to enroll the student
    toast({
      title: "Enrollment Successful",
      description: `Student ${studentId} has been enrolled in course ${courseId}`,
    });
    
    // After successful enrollment, navigate back to the student page
    setTimeout(() => {
      navigate("/admin/student");
    }, 1500);
  };

  const filteredCourses = courses.filter((course) => {
    return (
      course.course_id.toLowerCase().includes(filters.course_id.toLowerCase()) &&
      course.course_code.toLowerCase().includes(filters.course_code.toLowerCase()) &&
      course.subject.toLowerCase().includes(filters.subject.toLowerCase()) &&
      course.grade.toLowerCase().includes(filters.grade.toLowerCase()) &&
      course.stream.toLowerCase().includes(filters.stream.toLowerCase()) &&
      course.teacher_id.toLowerCase().includes(filters.teacher_id.toLowerCase())
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/student")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Enroll Student</h1>
            <p className="text-muted-foreground mb-6">
              Student ID: {studentId}
            </p>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Course ID</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.course_id}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              course_id: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Course Code</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.course_code}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              course_code: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Subject</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.subject}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              subject: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Grade</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.grade}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              grade: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Stream</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.stream}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              stream: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Teacher ID</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.teacher_id}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              teacher_id: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-8"
                      >
                        No courses available for enrollment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((course) => (
                      <TableRow key={course.course_id}>
                        <TableCell>{course.course_id}</TableCell>
                        <TableCell>{course.course_code}</TableCell>
                        <TableCell>{course.subject}</TableCell>
                        <TableCell>{course.grade}</TableCell>
                        <TableCell>{course.stream}</TableCell>
                        <TableCell>{course.teacher_id}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            onClick={() => handleEnroll(course.course_id)}
                          >
                            Enroll
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentEnrollment;
