import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";
import { useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const resultSchema = z.object({
  result_id: z.string().trim().min(1, "Result ID is required"),
  assessment_id: z.string().trim().min(1, "Assessment ID is required"),
  student_id: z.string().trim().min(1, "Student ID is required"),
  marks_obtained: z.coerce.number().int().min(0, "Marks must be 0 or greater"),
  graded_at: z.string().min(1, "Graded at is required"),
});

type Result = z.infer<typeof resultSchema>;

const AssessmentResults = () => {
  const { courseId, assessmentId } = useParams();
  const { toast } = useToast();

  const [rows, setRows] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const form = useForm<Result>({
    resolver: zodResolver(resultSchema),
    defaultValues: { result_id: "", assessment_id: assessmentId || "", student_id: "", marks_obtained: 0, graded_at: "" },
  });

  const headers = useMemo(() => ["result_id", "assessment_id", "student_id", "marks_obtained", "graded_at", "actions"], []);

  const onSubmit = (values: Result) => {
    const duplicateAt = rows.findIndex((r) => r.result_id === values.result_id);
    if (editIndex === null) {
      if (duplicateAt !== -1) {
        toast({ title: "Duplicate entry", description: "Result ID already exists." });
        return;
      }
      setRows((prev) => [...prev, values]);
      toast({ title: "Result added" });
    } else {
      if (duplicateAt !== -1 && duplicateAt !== editIndex) {
        toast({ title: "Duplicate entry", description: "Another result with same ID exists." });
        return;
      }
      setRows((prev) => prev.map((r, i) => (i === editIndex ? values : r)));
      toast({ title: "Result updated" });
    }
    setOpen(false);
    setEditIndex(null);
    form.reset({ result_id: "", assessment_id: assessmentId || "", student_id: "", marks_obtained: 0, graded_at: "" });
  };

  const handleDelete = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    toast({ title: "Result deleted" });
  };

  const handleEdit = (index: number) => {
    const r = rows[index];
    form.reset({ ...r });
    setEditIndex(index);
    setOpen(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Assessment Result - {courseId} / {assessmentId}</h1>
              <Dialog open={open} onOpenChange={(v) => { if (!v) { setEditIndex(null); form.reset({ result_id: "", assessment_id: assessmentId || "", student_id: "", marks_obtained: 0, graded_at: "" }); } setOpen(v); }}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditIndex(null); form.reset({ result_id: "", assessment_id: assessmentId || "", student_id: "", marks_obtained: 0, graded_at: "" }); }}>
                    <Plus className="mr-2" /> Add Result
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editIndex === null ? "Add Result" : "Edit Result"}</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="result_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>result_id</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., R001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="assessment_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>assessment_id</FormLabel>
                          <FormControl>
                            <Input placeholder="Assessment ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="student_id" render={({ field }) => (
                        <FormItem>
                          <FormLabel>student_id</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., S123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="marks_obtained" render={({ field }) => (
                        <FormItem>
                          <FormLabel>marks_obtained</FormLabel>
                          <FormControl>
                            <Input type="number" min={0} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="graded_at" render={({ field }) => (
                        <FormItem>
                          <FormLabel>graded_at</FormLabel>
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
                        No results yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((r, idx) => (
                      <TableRow key={`${r.result_id}-${idx}`}>
                        <TableCell>{r.result_id}</TableCell>
                        <TableCell>{r.assessment_id}</TableCell>
                        <TableCell>{r.student_id}</TableCell>
                        <TableCell>{r.marks_obtained}</TableCell>
                        <TableCell>{r.graded_at}</TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(idx)}>
                            <Pencil /> Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(idx)}>
                            <Trash2 /> Delete
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

export default AssessmentResults;
