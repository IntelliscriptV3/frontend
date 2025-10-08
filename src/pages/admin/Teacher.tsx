import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Trash2, Eye, BookOpen, Users } from "lucide-react";

type TeacherItem = {
  teacher_id: string;
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  age: number;
};

type CourseItem = {
  course_id: string;
  teacher_id: string;
  course_code: string;
  subject: string;
  grade: string;
  stream: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  classroom: string;
};

type AssessmentItem = {
  description: string;
  start_time: string;
  end_time: string;
};

const Teacher = () => {
  const [view, setView] = useState<"menu" | "teachers" | "courses">("menu");
  const [teacherData, setTeacherData] = useState<TeacherItem[]>([]);
  const [courseData, setCourseData] = useState<CourseItem[]>([]);
  const [teacherFilters, setTeacherFilters] = useState({
    teacher_id: "",
    user_id: "",
    name: "",
    address: "",
  });
  const [courseFilters, setCourseFilters] = useState({
    course_id: "",
    teacher_id: "",
    course_code: "",
    subject: "",
    grade: "",
    stream: "",
  });
  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);

  const handleViewAssessment = (course: CourseItem) => {
    setSelectedCourse(course);
    // TODO: Fetch assessments from backend
    setAssessments([]);
    setAssessmentDialogOpen(true);
  };

  const filteredTeachers = teacherData.filter((item) => {
    const fullName = `${item.first_name} ${item.middle_name} ${item.last_name}`.toLowerCase();
    const fullAddress = `${item.address_line1} ${item.address_line2} ${item.address_line3}`.toLowerCase();
    return (
      item.teacher_id.toLowerCase().includes(teacherFilters.teacher_id.toLowerCase()) &&
      item.user_id.toLowerCase().includes(teacherFilters.user_id.toLowerCase()) &&
      fullName.includes(teacherFilters.name.toLowerCase()) &&
      fullAddress.includes(teacherFilters.address.toLowerCase())
    );
  });

  const filteredCourses = courseData.filter((item) => {
    return (
      item.course_id.toLowerCase().includes(courseFilters.course_id.toLowerCase()) &&
      item.teacher_id.toLowerCase().includes(courseFilters.teacher_id.toLowerCase()) &&
      item.course_code.toLowerCase().includes(courseFilters.course_code.toLowerCase()) &&
      item.subject.toLowerCase().includes(courseFilters.subject.toLowerCase()) &&
      item.grade.toLowerCase().includes(courseFilters.grade.toLowerCase()) &&
      item.stream.toLowerCase().includes(courseFilters.stream.toLowerCase())
    );
  });

  if (view === "menu") {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Teacher Management</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setView("teachers")}
                  className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 cursor-pointer hover:border-primary transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold">Teachers</h2>
                    <p className="text-muted-foreground">Manage teacher information</p>
                  </div>
                </div>

                <div
                  onClick={() => setView("courses")}
                  className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 cursor-pointer hover:border-primary transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold">Courses</h2>
                    <p className="text-muted-foreground">Manage course information</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (view === "teachers") {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center mb-6">
                <Button variant="ghost" onClick={() => setView("menu")} className="mb-2">
                  ← Back
                </Button>
              </div>
              <h1 className="text-3xl font-bold mb-6">Teachers</h1>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Teacher ID</div>
                          <Input
                            placeholder="Filter..."
                            value={teacherFilters.teacher_id}
                            onChange={(e) =>
                              setTeacherFilters((prev) => ({
                                ...prev,
                                teacher_id: e.target.value,
                              }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>User ID</div>
                          <Input
                            placeholder="Filter..."
                            value={teacherFilters.user_id}
                            onChange={(e) =>
                              setTeacherFilters((prev) => ({
                                ...prev,
                                user_id: e.target.value,
                              }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Teacher Name</div>
                          <Input
                            placeholder="Filter..."
                            value={teacherFilters.name}
                            onChange={(e) =>
                              setTeacherFilters((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Address</div>
                          <Input
                            placeholder="Filter..."
                            value={teacherFilters.address}
                            onChange={(e) =>
                              setTeacherFilters((prev) => ({
                                ...prev,
                                address: e.target.value,
                              }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No teachers yet. Data will appear here when added.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTeachers.map((item) => (
                        <TableRow key={item.teacher_id}>
                          <TableCell>{item.teacher_id}</TableCell>
                          <TableCell>{item.user_id}</TableCell>
                          <TableCell>
                            {`${item.first_name} ${item.middle_name} ${item.last_name}`}
                          </TableCell>
                          <TableCell>
                            {`${item.address_line1} ${item.address_line2} ${item.address_line3}`}
                          </TableCell>
                          <TableCell>{item.age}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center mb-6">
              <Button variant="ghost" onClick={() => setView("menu")} className="mb-2">
                ← Back
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-6">Courses</h1>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Course ID</div>
                        <Input
                          placeholder="Filter..."
                          value={courseFilters.course_id}
                          onChange={(e) =>
                            setCourseFilters((prev) => ({
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
                        <div>Teacher ID</div>
                        <Input
                          placeholder="Filter..."
                          value={courseFilters.teacher_id}
                          onChange={(e) =>
                            setCourseFilters((prev) => ({
                              ...prev,
                              teacher_id: e.target.value,
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
                          value={courseFilters.course_code}
                          onChange={(e) =>
                            setCourseFilters((prev) => ({
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
                          value={courseFilters.subject}
                          onChange={(e) =>
                            setCourseFilters((prev) => ({
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
                          value={courseFilters.grade}
                          onChange={(e) =>
                            setCourseFilters((prev) => ({
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
                          value={courseFilters.stream}
                          onChange={(e) =>
                            setCourseFilters((prev) => ({
                              ...prev,
                              stream: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Day of Week</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Classroom</TableHead>
                    <TableHead>Current Assessment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCourses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                        No courses yet. Data will appear here when added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCourses.map((item) => (
                      <TableRow key={item.course_id}>
                        <TableCell>{item.course_id}</TableCell>
                        <TableCell>{item.teacher_id}</TableCell>
                        <TableCell>{item.course_code}</TableCell>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.grade}</TableCell>
                        <TableCell>{item.stream}</TableCell>
                        <TableCell>{item.day_of_week}</TableCell>
                        <TableCell>{item.start_time}</TableCell>
                        <TableCell>{item.end_time}</TableCell>
                        <TableCell>{item.classroom}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAssessment(item)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
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

        <Dialog open={assessmentDialogOpen} onOpenChange={setAssessmentDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>
                Assessment - {selectedCourse?.subject}
              </DialogTitle>
              <DialogDescription>
                Teacher ID: {selectedCourse?.teacher_id}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                        No assessments available for this course.
                      </TableCell>
                    </TableRow>
                  ) : (
                    assessments.map((assessment, index) => (
                      <TableRow key={index}>
                        <TableCell>{assessment.description}</TableCell>
                        <TableCell>{assessment.start_time}</TableCell>
                        <TableCell>{assessment.end_time}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Teacher;
