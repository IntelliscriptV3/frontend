import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil, CheckSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const assessmentSchema = z.object({
  assessment_id: z.string().trim().min(1, "Assessment ID is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  max_marks: z.coerce.number().int().min(1, "Max marks must be at least 1"),
  assessment_date: z.string().min(1, "Assessment date is required"),
  end_date: z.string().min(1, "End date is required"),
});

type Assessment = z.infer<typeof assessmentSchema>;

const CourseAssessments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [rows, setRows] = useState<Assessment[]>([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const form = useForm<Assessment>({ resolver: zodResolver(assessmentSchema), defaultValues: { assessment_id: "", title: "", description: "", max_marks: 100, assessment_date: "", end_date: "" } });

  const headers = useMemo(() => ["assessment_id", "title", "description", "max_marks", "assessment_date", "end date", "actions"], []);

  const onSubmit = (values: Assessment) => {
    const duplicateAt = rows.findIndex((r) => r.assessment_id === values.assessment_id);
    if (editIndex === null) {
      if (duplicateAt !== -1) {
        toast({ title: "Duplicate entry", description: "Assessment ID already exists." });
        return;
      }
      setRows((prev) => [...prev, values]);
      toast({ title: "Assessment added" });
    } else {
      if (duplicateAt !== -1 && duplicateAt !== editIndex) {
        toast({ title: "Duplicate entry", description: "Another assessment with same ID exists." });
        return;
      }
      setRows((prev) => prev.map((r, i) => (i === editIndex ? values : r)));
      toast({ title: "Assessment updated" });
    }
    setOpen(false);
    setEditIndex(null);
    form.reset({ assessment_id: "", title: "", description: "", max_marks: 100, assessment_date: "", end_date: "" });
  };

  const handleDelete = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    toast({ title: "Assessment deleted" });
  };

  const handleEdit = (index: number) => {
    const r = rows[index];
    form.reset({ ...r });
    setEditIndex(index);
    setOpen(true);
  };

  const goToResults = (assessmentId: string) => {
    navigate(`/teacher/assessment/${encodeURIComponent(courseId || "")}/${encodeURIComponent(assessmentId)}/results`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Assessments - {courseId}</h1>
              <Dialog open={open} onOpenChange={(v) => { if (!v) { setEditIndex(null); form.reset({ assessment_id: "", title: "", description: "", max_marks: 100, assessment_date: "", end_date: "" }); } setOpen(v); }}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditIndex(null); form.reset({ assessment_id: "", title: "", description: "", max_marks: 100, assessment_date: "", end_date: "" }); }}>
                    <Plus className="mr-2" /> Add Assessment
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editIndex === null ? "Add Assessment" : "Edit Assessment"}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="assessment_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>assessment_id</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., A001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="title" render={({ field }) => (
                        <FormItem>
                          <FormLabel>title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Midterm" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem className="sm:col-span-2">
                          <FormLabel>description</FormLabel>
                          <FormControl>
                            <Input placeholder="Short description" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="max_marks" render={({ field }) => (
                        <FormItem>
                          <FormLabel>max_marks</FormLabel>
                          <FormControl>
                            <Input type="number" min={1} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="assessment_date" render={({ field }) => (
                        <FormItem>
                          <FormLabel>assessment_date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="end_date" render={({ field }) => (
                        <FormItem>
                          <FormLabel>end date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <DialogFooter className="sm:col-span-2 mt-2">
                        <Button type="submit">{editIndex === null ? "Save" : "Update"}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-md border border-border overflow-hidden bg-card">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((h) => (
                      <TableHead key={h}>{h}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
                        No assessments yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r, idx) => (
                      <TableRow key={`${r.assessment_id}-${idx}`}>
                        <TableCell>{r.assessment_id}</TableCell>
                        <TableCell>{r.title}</TableCell>
                        <TableCell>{r.description}</TableCell>
                        <TableCell>{r.max_marks}</TableCell>
                        <TableCell>{r.assessment_date}</TableCell>
                        <TableCell>{r.end_date}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(idx)}>
                            <Pencil /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(idx)}>
                            <Trash2 /> Delete
                          </Button>
                          <Button size="sm" onClick={() => goToResults(r.assessment_id)}>
                            <CheckSquare /> Marking
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

export default CourseAssessments;
