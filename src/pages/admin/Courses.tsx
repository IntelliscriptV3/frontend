import { useMemo, useState, useEffect } from "react";
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
import { Plus, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type CourseRecord = {
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

export type AssessmentRecord = {
  id: string; // Assessment_ID
  title: string; // Title
  description: string;
  start_time: string;
  end_time: string;
  max_marks: number;
};

export type AssessmentResult = {
  result_id: string;
  assessment_id: string;
  student_id: string;
  marks_obtained: number;
  graded_at: string;
};

const initialCourses: CourseRecord[] = [
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
    course_id: "C002",
    teacher_id: "T002",
    course_code: "ENG201",
    subject: "English",
    grade: "11",
    stream: "Arts",
    day_of_week: "Wednesday",
    start_time: "11:00",
    end_time: "12:30",
    class_room: "B2",
  },
];

const initialAssessments: Record<string, AssessmentRecord[]> = {
  C001: [
    {
      id: "A1",
      title: "Chapter 1 Quiz",
      description: "Quiz on Algebra basics",
      start_time: "2025-10-10 09:00",
      end_time: "2025-10-10 09:30",
      max_marks: 100,
    },
  ],
  C002: [],
};

function nextId(prefix: string, ids: string[]): string {
  const matches = ids
    .map((id) => id.match(new RegExp(`^${prefix}(\\d+)$`)))
    .filter((m): m is RegExpMatchArray => !!m);
  const padLen = matches.length ? Math.max(...matches.map((m) => m[1].length)) : 3;
  const maxNum = matches.length ? Math.max(...matches.map((m) => parseInt(m[1], 10))) : 0;
  const next = String(maxNum + 1).padStart(padLen, "0");
  return `${prefix}${next}`;
}

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseRecord[]>(initialCourses);
  const [assessments, setAssessments] = useState<Record<string, AssessmentRecord[]>>(initialAssessments);

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [originalCourseId, setOriginalCourseId] = useState<string | null>(null);
  const [form, setForm] = useState({
    course_id: "",
    teacher_id: "",
    course_code: "",
    subject: "",
    grade: "",
    stream: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    class_room: "",
  });

  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [assessmentCourseId, setAssessmentCourseId] = useState<string | null>(null);
  const [assessmentForm, setAssessmentForm] = useState({ title: "", description: "", start_time: "", end_time: "", max_marks: "" });
  const [editingAssessmentId, setEditingAssessmentId] = useState<string | null>(null);

  const [resultsOpen, setResultsOpen] = useState(false);
  const [resultsAssessmentId, setResultsAssessmentId] = useState<string | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);
  const [results, setResults] = useState<AssessmentResult[]>([]);

  const selectedCourse = useMemo(() => courses.find((c) => c.course_id === assessmentCourseId) || null, [courses, assessmentCourseId]);

  const resetForm = () =>
    setForm({
      course_id: "",
      teacher_id: "",
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
      teacher_id: "",
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
    const newCourse: CourseRecord = {
      course_id: form.course_id,
      teacher_id: form.teacher_id,
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

  const openEdit = (c: CourseRecord) => {
    setEditingCourseId(c.course_id);
    setOriginalCourseId(c.course_id);
    setForm({
      course_id: c.course_id,
      teacher_id: c.teacher_id,
      course_code: c.course_code,
      subject: c.subject,
      grade: c.grade,
      stream: c.stream,
      day_of_week: c.day_of_week,
      start_time: c.start_time,
      end_time: c.end_time,
      class_room: c.class_room,
    });
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editingCourseId) return;
    const newId = form.course_id;
    const oldId = originalCourseId;

    setCourses((prev) =>
      prev.map((c) =>
        c.course_id === editingCourseId
          ? {
              ...c,
              course_id: newId,
              teacher_id: form.teacher_id,
              course_code: form.course_code,
              subject: form.subject,
              grade: form.grade,
              stream: form.stream,
              day_of_week: form.day_of_week,
              start_time: form.start_time,
              end_time: form.end_time,
              class_room: form.class_room,
            }
          : c,
      ),
    );

    if (oldId && oldId !== newId) {
      setAssessments((prev) => {
        const current = prev[oldId] || [];
        const { [oldId]: _removed, ...rest } = prev;
        return { ...rest, [newId]: (prev[newId] || []).concat(current) };
      });
    }

    setEditOpen(false);
    setEditingCourseId(null);
    setOriginalCourseId(null);
    resetForm();
  };

  const openAssessments = (course_id: string) => {
    setAssessmentCourseId(course_id);
    setAssessmentOpen(true);
    setAssessmentForm({ title: "", description: "", start_time: "", end_time: "", max_marks: "" });
    setEditingAssessmentId(null);
  };

  const addAssessment = () => {
    if (!assessmentCourseId) return;
    const id = Date.now().toString();
    const newRec: AssessmentRecord = {
      id: `AS${id}`,
      title: assessmentForm.title,
      description: assessmentForm.description,
      start_time: assessmentForm.start_time,
      end_time: assessmentForm.end_time,
      max_marks: Number(assessmentForm.max_marks) || 0,
    };
    setAssessments((prev) => ({ ...prev, [assessmentCourseId]: [...(prev[assessmentCourseId] || []), newRec] }));
    setAssessmentForm({ title: "", description: "", start_time: "", end_time: "", max_marks: "" });
  };

  const startEditAssessment = (a: AssessmentRecord) => {
    setEditingAssessmentId(a.id);
    setAssessmentForm({ title: a.title, description: a.description, start_time: a.start_time, end_time: a.end_time, max_marks: String(a.max_marks) });
  };

  const saveAssessment = () => {
    if (!assessmentCourseId || !editingAssessmentId) return;
    setAssessments((prev) => ({
      ...prev,
      [assessmentCourseId]: (prev[assessmentCourseId] || []).map((a) =>
        a.id === editingAssessmentId
          ? {
              ...a,
              title: assessmentForm.title,
              description: assessmentForm.description,
              start_time: assessmentForm.start_time,
              end_time: assessmentForm.end_time,
              max_marks: Number(assessmentForm.max_marks) || 0,
            }
          : a,
      ),
    }));
    setEditingAssessmentId(null);
    setAssessmentForm({ title: "", description: "", start_time: "", end_time: "", max_marks: "" });
  };

  const openResults = (assessment_id: string) => {
    setResultsAssessmentId(assessment_id);
    setResultsOpen(true);
  };

  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

  useEffect(() => {
    const fetchResults = async (assessmentId: string) => {
      setResultsLoading(true);
      setResultsError(null);
      try {
        const res = await fetch(`${API_BASE}/api/assessments/${encodeURIComponent(assessmentId)}/results`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) {
          throw new Error(`Failed to load results (${res.status})`);
        }
        const data: AssessmentResult[] = await res.json();
        setResults(data);
      } catch (e: any) {
        setResultsError(e?.message || "Unable to load results");
        setResults([]);
      } finally {
        setResultsLoading(false);
      }
    };

    if (resultsOpen && resultsAssessmentId) {
      fetchResults(resultsAssessmentId);
    } else if (!resultsOpen) {
      setResults([]);
      setResultsError(null);
      setResultsLoading(false);
    }
  }, [resultsOpen, resultsAssessmentId]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Button variant="ghost" onClick={() => navigate("/admin/teacher")} className="mb-2">
                  ← Back
                </Button>
                <h1 className="text-3xl font-bold">Courses</h1>
              </div>
              <Button onClick={openAddWithDefaults}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>Course Code</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Stream</TableHead>
                    <TableHead>Day of Week</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Class Room</TableHead>
                    <TableHead>Current Assessment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                        No courses yet. Click "Add Course" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    courses.map((c) => (
                      <TableRow key={c.course_id}>
                        <TableCell>{c.course_id}</TableCell>
                        <TableCell>{c.teacher_id}</TableCell>
                        <TableCell>{c.course_code}</TableCell>
                        <TableCell>{c.subject}</TableCell>
                        <TableCell>{c.grade}</TableCell>
                        <TableCell>{c.stream}</TableCell>
                        <TableCell>{c.day_of_week}</TableCell>
                        <TableCell>{c.start_time}</TableCell>
                        <TableCell>{c.end_time}</TableCell>
                        <TableCell>{c.class_room}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => openAssessments(c.course_id)}>View Assessments</Button>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline" onClick={() => openEdit(c)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </TableCell>
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
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Course ID" value={form.course_id} onChange={(e) => setForm((p) => ({ ...p, course_id: e.target.value }))} />
                  <Input placeholder="Teacher ID" value={form.teacher_id} onChange={(e) => setForm((p) => ({ ...p, teacher_id: e.target.value }))} />
                </div>
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
                <Button onClick={handleAdd}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Course</DialogTitle>
                <DialogDescription>Update the course details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Course ID" value={form.course_id} onChange={(e) => setForm((p) => ({ ...p, course_id: e.target.value }))} />
                  <Input placeholder="Teacher ID" value={form.teacher_id} onChange={(e) => setForm((p) => ({ ...p, teacher_id: e.target.value }))} />
                </div>
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
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button onClick={saveEdit}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={assessmentOpen} onOpenChange={setAssessmentOpen}>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Assessments {selectedCourse ? `— ${selectedCourse.subject} (Teacher: ${selectedCourse.teacher_id})` : ""}
                </DialogTitle>
                <DialogDescription>Manage current assessments for this course.</DialogDescription>
              </DialogHeader>

              <div className="rounded-md border overflow-x-auto mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Max Marks</TableHead>
                      <TableHead>Actions</TableHead>
                      <TableHead>Results</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(assessments[assessmentCourseId || ""] || []).length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          No assessments yet. Use the form below to add one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      (assessments[assessmentCourseId || ""] || []).map((a) => (
                        <TableRow key={a.id}>
                          <TableCell>{a.id}</TableCell>
                          <TableCell>{a.title}</TableCell>
                          <TableCell>{a.description}</TableCell>
                          <TableCell>{a.start_time}</TableCell>
                          <TableCell>{a.end_time}</TableCell>
                          <TableCell>{a.max_marks}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline" onClick={() => startEditAssessment(a)}>
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => openResults(a.id)}>View Results</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-3">
                <Input placeholder="Title" value={assessmentForm.title} onChange={(e) => setAssessmentForm((p) => ({ ...p, title: e.target.value }))} />
                <Input placeholder="Description" value={assessmentForm.description} onChange={(e) => setAssessmentForm((p) => ({ ...p, description: e.target.value }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Start Time (e.g., 2025-10-10 09:00)" value={assessmentForm.start_time} onChange={(e) => setAssessmentForm((p) => ({ ...p, start_time: e.target.value }))} />
                  <Input placeholder="End Time (e.g., 2025-10-10 10:00)" value={assessmentForm.end_time} onChange={(e) => setAssessmentForm((p) => ({ ...p, end_time: e.target.value }))} />
                </div>
                <Input placeholder="Max Marks (e.g., 100)" value={assessmentForm.max_marks} onChange={(e) => setAssessmentForm((p) => ({ ...p, max_marks: e.target.value }))} />
                {editingAssessmentId ? (
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setEditingAssessmentId(null); setAssessmentForm({ title: "", description: "", start_time: "", end_time: "", max_marks: "" }); }}>Cancel</Button>
                    <Button onClick={saveAssessment}>Save</Button>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Button onClick={addAssessment}>Add Assessment</Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={resultsOpen} onOpenChange={setResultsOpen}>
            <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Assessment Results {resultsAssessmentId ? `— ${resultsAssessmentId}` : ""}</DialogTitle>
                <DialogDescription>Results fetched from backend.</DialogDescription>
              </DialogHeader>

              {resultsLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading results…</div>
              ) : resultsError ? (
                <div className="py-8 text-center text-red-600">{resultsError}</div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No results available.</div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>result_id</TableHead>
                        <TableHead>assessment_id</TableHead>
                        <TableHead>student_id</TableHead>
                        <TableHead>marks_obtained</TableHead>
                        <TableHead>graded_at</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((r) => (
                        <TableRow key={r.result_id}>
                          <TableCell>{r.result_id}</TableCell>
                          <TableCell>{r.assessment_id}</TableCell>
                          <TableCell>{r.student_id}</TableCell>
                          <TableCell>{r.marks_obtained}</TableCell>
                          <TableCell>{r.graded_at}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Courses;
