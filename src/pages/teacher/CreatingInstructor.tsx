import { useMemo, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type InstructorRecord = {
  instructorId: string;
  instructorName: string;
  moduleId: string;
  moduleName: string;
};

const schema = z.object({
  instructorId: z.string().trim().min(1, "Instructor ID is required"),
  instructorName: z.string().trim().min(1, "Instructor Name is required"),
  moduleId: z.string().trim().min(1, "Module ID is required"),
  moduleName: z.string().trim().min(1, "Module Name is required"),
});

const CreatingInstructor = () => {
  const [records, setRecords] = useState<InstructorRecord[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { instructorId: "", instructorName: "", moduleId: "", moduleName: "" },
  });

  const headers = useMemo(
    () => ["Instructor_ID", "Instructor Name", "Module_ID", "Module_Name", "Actions"],
    [],
  );

  const onSubmit = (values: z.infer<typeof schema>) => {
    const exists = records.some(
      (r) => r.instructorId === values.instructorId && r.moduleId === values.moduleId,
    );
    if (exists) {
      toast({ title: "Duplicate entry", description: "This Instructor_ID and Module_ID combination already exists." });
      return;
    }

    setRecords((prev) => [...prev, values]);
    setOpen(false);
    form.reset();
    toast({ title: "Instructor added", description: `${values.instructorName} assigned to ${values.moduleName}` });
  };

  const handleDelete = (index: number) => {
    setRecords((prev) => prev.filter((_, i) => i !== index));
    toast({ title: "Entry deleted" });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">Creating Instructor</h1>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2" /> Add Instructor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Instructor</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <FormField
                        control={form.control}
                        name="instructorId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructor_ID</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., I001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="instructorName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructor Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Jane Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="moduleId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module_ID</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., M101" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="moduleName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Module_Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Database Systems" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter className="sm:col-span-2 mt-2">
                        <Button type="submit">Save</Button>
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
                  {records.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
                        No instructors added yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    records.map((r, idx) => (
                      <TableRow key={`${r.instructorId}-${r.moduleId}-${idx}`}>
                        <TableCell>{r.instructorId}</TableCell>
                        <TableCell>{r.instructorName}</TableCell>
                        <TableCell>{r.moduleId}</TableCell>
                        <TableCell>{r.moduleName}</TableCell>
                        <TableCell>
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

export default CreatingInstructor;
