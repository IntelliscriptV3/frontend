import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";

type CourseRecord = {
  course_id: string;
  teacher_id: string;
  course_code: string;
  subject: string;
  grade: string;
  stream: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  class_room: string;
};

const dummyCourses: CourseRecord[] = [
  {
    course_id: "C001",
    teacher_id: "T001",
    course_code: "MTH101",
    subject: "Mathematics",
    grade: "12",
    stream: "Science",
    day_of_week: "Monday",
    start_time: "09:00",
    end_time: "10:30",
    class_room: "A1",
  },
  {
    course_id: "C003",
    teacher_id: "T001",
    course_code: "PHY201",
    subject: "Physics",
    grade: "11",
    stream: "Science",
    day_of_week: "Wednesday",
    start_time: "11:00",
    end_time: "12:30",
    class_room: "B3",
  },
];

function nextId(prefix: string, ids: string[]): string {
  const matches = ids
    .map((id) => id.match(new RegExp(`^${prefix}(\\d+)$`)))
    .filter((m): m is RegExpMatchArray => !!m);
  const padLen = matches.length ? Math.max(...matches.map((m) => m[1].length)) : 3;
  const maxNum = matches.length ? Math.max(...matches.map((m) => parseInt(m[1], 10))) : 0;
  const next = String(maxNum + 1).padStart(padLen, "0");
  return `${prefix}${next}`;
}

const TeacherCourses = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseRecord[]>(
    dummyCourses.filter((c) => c.teacher_id === teacherId)
  );
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    course_id: "",
    course_code: "",
    subject: "",
    grade: "",
    stream: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    class_room: "",
  });

  const resetForm = () =>
    setForm({
      course_id: "",
      course_code: "",
      subject: "",
      grade: "",
      stream: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      class_room: "",
    });

  const openAddWithDefaults = () => {
    const nextCourseId = nextId("C", courses.map((c) => c.course_id));
    setForm({
      course_id: nextCourseId,
      course_code: "",
      subject: "",
      grade: "",
      stream: "",
      day_of_week: "",
      start_time: "",
      end_time: "",
      class_room: "",
    });
    setAddOpen(true);
  };

  const handleAdd = () => {
    if (!teacherId) return;
    const newCourse: CourseRecord = {
      course_id: form.course_id,
      teacher_id: teacherId,
      course_code: form.course_code,
      subject: form.subject,
      grade: form.grade,
      stream: form.stream,
      day_of_week: form.day_of_week,
      start_time: form.start_time,
      end_time: form.end_time,
      class_room: form.class_room,
    };
    setCourses((prev) => [...prev, newCourse]);
    setAddOpen(false);
    resetForm();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button variant="ghost" onClick={() => navigate("/admin/teacher/teachers")} className="mb-2">
                  ← Back to Teachers
                </Button>
                <h1 className="text-3xl font-bold">Courses for Teacher {teacherId}</h1>
              </div>
              <Button onClick={openAddWithDefaults}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Course
              </Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Stream</TableHead>
                    <TableHead>Day of Week</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Class Room</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                        No courses assigned to this teacher yet. Click "Add New Course" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses.map((c) => (
                      <TableRow key={c.course_id}>
                        <TableCell>{c.course_id}</TableCell>
                        <TableCell>{c.course_code}</TableCell>
                        <TableCell>{c.subject}</TableCell>
                        <TableCell>{c.grade}</TableCell>
                        <TableCell>{c.stream}</TableCell>
                        <TableCell>{c.day_of_week}</TableCell>
                        <TableCell>{c.start_time}</TableCell>
                        <TableCell>{c.end_time}</TableCell>
                        <TableCell>{c.class_room}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Course</DialogTitle>
                <DialogDescription>Enter the course details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <Input placeholder="Course ID" value={form.course_id} onChange={(e) => setForm((p) => ({ ...p, course_id: e.target.value }))} />
                <Input placeholder="Course Code" value={form.course_code} onChange={(e) => setForm((p) => ({ ...p, course_code: e.target.value }))} />
                <Input placeholder="Subject" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
                <Input placeholder="Grade" value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))} />
                <Input placeholder="Stream" value={form.stream} onChange={(e) => setForm((p) => ({ ...p, stream: e.target.value }))} />
                <Input placeholder="Day of Week" value={form.day_of_week} onChange={(e) => setForm((p) => ({ ...p, day_of_week: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Start Time (e.g., 09:00)" value={form.start_time} onChange={(e) => setForm((p) => ({ ...p, start_time: e.target.value }))} />
                  <Input placeholder="End Time (e.g., 10:30)" value={form.end_time} onChange={(e) => setForm((p) => ({ ...p, end_time: e.target.value }))} />
                </div>
                <Input placeholder="Class Room" value={form.class_room} onChange={(e) => setForm((p) => ({ ...p, class_room: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add Course</Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default TeacherCourses;
