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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, Plus, GraduationCap, Users } from "lucide-react";

type EnrollmentItem = {
  enrollment_id: string;
  student_id: string;
  course_id: string;
};

type StudentItem = {
  student_id: string;
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  contact_no: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  age: number;
  stream: string;
  grade: string;
};

const Student = () => {
  const [view, setView] = useState<"menu" | "enrollment" | "student">("menu");
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentItem[]>([]);
  const [studentData, setStudentData] = useState<StudentItem[]>([]);
  const [enrollmentFilters, setEnrollmentFilters] = useState({
    enrollment_id: "",
    student_id: "",
    course_id: "",
  });
  const [studentFilters, setStudentFilters] = useState({
    student_id: "",
    user_id: "",
    name: "",
    contact_no: "",
    address: "",
    stream: "",
    grade: "",
  });
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    contact_no: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    age: "",
    stream: "",
    grade: "",
  });

  const handleAddStudent = () => {
    console.log("Adding new student:", newStudent);
    // TODO: Implement backend submission
    setAddStudentOpen(false);
    setNewStudent({
      first_name: "",
      middle_name: "",
      last_name: "",
      contact_no: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      age: "",
      stream: "",
      grade: "",
    });
  };

  const filteredEnrollment = enrollmentData.filter((item) => {
    return (
      item.enrollment_id.toLowerCase().includes(enrollmentFilters.enrollment_id.toLowerCase()) &&
      item.student_id.toLowerCase().includes(enrollmentFilters.student_id.toLowerCase()) &&
      item.course_id.toLowerCase().includes(enrollmentFilters.course_id.toLowerCase())
    );
  });

  const filteredStudents = studentData.filter((item) => {
    const fullName = `${item.first_name} ${item.middle_name} ${item.last_name}`.toLowerCase();
    const fullAddress = `${item.address_line1} ${item.address_line2} ${item.address_line3}`.toLowerCase();
    return (
      item.student_id.toLowerCase().includes(studentFilters.student_id.toLowerCase()) &&
      item.user_id.toLowerCase().includes(studentFilters.user_id.toLowerCase()) &&
      fullName.includes(studentFilters.name.toLowerCase()) &&
      item.contact_no.toLowerCase().includes(studentFilters.contact_no.toLowerCase()) &&
      fullAddress.includes(studentFilters.address.toLowerCase()) &&
      item.stream.toLowerCase().includes(studentFilters.stream.toLowerCase()) &&
      item.grade.toLowerCase().includes(studentFilters.grade.toLowerCase())
    );
  });

  if (view === "menu") {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Student Management</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setView("enrollment")}
                  className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 cursor-pointer hover:border-primary transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <GraduationCap className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold">Enrollment</h2>
                    <p className="text-muted-foreground">Manage student enrollments</p>
                  </div>
                </div>

                <div
                  onClick={() => setView("student")}
                  className="group relative overflow-hidden rounded-lg border-2 border-border bg-card p-8 cursor-pointer hover:border-primary transition-all hover:scale-105"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold">Student</h2>
                    <p className="text-muted-foreground">Manage student information</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (view === "enrollment") {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Button variant="ghost" onClick={() => setView("menu")} className="mb-2">
                    ← Back
                  </Button>
                  <h1 className="text-3xl font-bold">Enrollment</h1>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Enrollment ID</div>
                          <Input
                            placeholder="Filter..."
                            value={enrollmentFilters.enrollment_id}
                            onChange={(e) =>
                              setEnrollmentFilters((prev) => ({
                                ...prev,
                                enrollment_id: e.target.value,
                              }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Student ID</div>
                          <Input
                            placeholder="Filter..."
                            value={enrollmentFilters.student_id}
                            onChange={(e) =>
                              setEnrollmentFilters((prev) => ({
                                ...prev,
                                student_id: e.target.value,
                              }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Course ID</div>
                          <Input
                            placeholder="Filter..."
                            value={enrollmentFilters.course_id}
                            onChange={(e) =>
                              setEnrollmentFilters((prev) => ({
                                ...prev,
                                course_id: e.target.value,
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
                    {filteredEnrollment.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                          No enrollment records yet. Data will appear here when added.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEnrollment.map((item) => (
                        <TableRow key={item.enrollment_id}>
                          <TableCell>{item.enrollment_id}</TableCell>
                          <TableCell>{item.student_id}</TableCell>
                          <TableCell>{item.course_id}</TableCell>
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
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button variant="ghost" onClick={() => setView("menu")} className="mb-2">
                  ← Back
                </Button>
                <h1 className="text-3xl font-bold">Students</h1>
              </div>
              <Button onClick={() => setAddStudentOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Student ID</div>
                        <Input
                          placeholder="Filter..."
                          value={studentFilters.student_id}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
                              ...prev,
                              student_id: e.target.value,
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
                          value={studentFilters.user_id}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
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
                        <div>Name</div>
                        <Input
                          placeholder="Filter..."
                          value={studentFilters.name}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
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
                        <div>Contact No</div>
                        <Input
                          placeholder="Filter..."
                          value={studentFilters.contact_no}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
                              ...prev,
                              contact_no: e.target.value,
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
                          value={studentFilters.address}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
                              ...prev,
                              address: e.target.value,
                            }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Stream</div>
                        <Input
                          placeholder="Filter..."
                          value={studentFilters.stream}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
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
                        <div>Grade</div>
                        <Input
                          placeholder="Filter..."
                          value={studentFilters.grade}
                          onChange={(e) =>
                            setStudentFilters((prev) => ({
                              ...prev,
                              grade: e.target.value,
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
                  {filteredStudents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No students yet. Click "Add Student" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStudents.map((item) => (
                      <TableRow key={item.student_id}>
                        <TableCell>{item.student_id}</TableCell>
                        <TableCell>{item.user_id}</TableCell>
                        <TableCell>
                          {`${item.first_name} ${item.middle_name} ${item.last_name}`}
                        </TableCell>
                        <TableCell>{item.contact_no}</TableCell>
                        <TableCell>
                          {`${item.address_line1} ${item.address_line2} ${item.address_line3}`}
                        </TableCell>
                        <TableCell>{item.age}</TableCell>
                        <TableCell>{item.stream}</TableCell>
                        <TableCell>{item.grade}</TableCell>
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

        <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>Enter the student details below.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={newStudent.first_name}
                    onChange={(e) =>
                      setNewStudent((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middle_name">Middle Name</Label>
                  <Input
                    id="middle_name"
                    value={newStudent.middle_name}
                    onChange={(e) =>
                      setNewStudent((prev) => ({ ...prev, middle_name: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={newStudent.last_name}
                    onChange={(e) =>
                      setNewStudent((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_no">Contact Number</Label>
                <Input
                  id="contact_no"
                  value={newStudent.contact_no}
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, contact_no: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line1">Address Line 1</Label>
                <Input
                  id="address_line1"
                  value={newStudent.address_line1}
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, address_line1: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line2">Address Line 2</Label>
                <Input
                  id="address_line2"
                  value={newStudent.address_line2}
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, address_line2: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address_line3">Address Line 3</Label>
                <Input
                  id="address_line3"
                  value={newStudent.address_line3}
                  onChange={(e) =>
                    setNewStudent((prev) => ({ ...prev, address_line3: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newStudent.age}
                    onChange={(e) =>
                      setNewStudent((prev) => ({ ...prev, age: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stream">Stream</Label>
                  <Input
                    id="stream"
                    value={newStudent.stream}
                    onChange={(e) =>
                      setNewStudent((prev) => ({ ...prev, stream: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Input
                    id="grade"
                    value={newStudent.grade}
                    onChange={(e) =>
                      setNewStudent((prev) => ({ ...prev, grade: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleAddStudent}>Add Student</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default Student;
