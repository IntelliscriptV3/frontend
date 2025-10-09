import { useState } from "react";
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
import { Plus, Edit, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type TeacherRecord = {
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

const initialTeachers: TeacherRecord[] = [
  {
    teacher_id: "T001",
    user_id: "U001",
    first_name: "Samantha",
    middle_name: "Kumar",
    last_name: "Perera",
    address_line1: "No. 45",
    address_line2: "Temple Road",
    address_line3: "Kandy",
    age: 35,
  },
  {
    teacher_id: "T002",
    user_id: "U002",
    first_name: "Nadeesha",
    middle_name: "",
    last_name: "Fernando",
    address_line1: "No. 12",
    address_line2: "Main Street",
    address_line3: "Colombo",
    age: 29,
  },
];

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<TeacherRecord[]>(initialTeachers);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    age: "",
  });

  const resetForm = () =>
    setForm({
      first_name: "",
      middle_name: "",
      last_name: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      age: "",
    });

  const handleAdd = () => {
    const id = Date.now().toString();
    const newTeacher: TeacherRecord = {
      teacher_id: `T${id}`,
      user_id: `U${id}`,
      first_name: form.first_name,
      middle_name: form.middle_name,
      last_name: form.last_name,
      address_line1: form.address_line1,
      address_line2: form.address_line2,
      address_line3: form.address_line3,
      age: Number(form.age),
    };
    setTeachers((prev) => [...prev, newTeacher]);
    setAddOpen(false);
    resetForm();
  };

  const handleEditOpen = (t: TeacherRecord) => {
    setEditingId(t.teacher_id);
    setForm({
      first_name: t.first_name,
      middle_name: t.middle_name,
      last_name: t.last_name,
      address_line1: t.address_line1,
      address_line2: t.address_line2,
      address_line3: t.address_line3,
      age: String(t.age),
    });
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (!editingId) return;
    setTeachers((prev) =>
      prev.map((t) =>
        t.teacher_id === editingId
          ? {
              ...t,
              first_name: form.first_name,
              middle_name: form.middle_name,
              last_name: form.last_name,
              address_line1: form.address_line1,
              address_line2: form.address_line2,
              address_line3: form.address_line3,
              age: Number(form.age),
            }
          : t,
      ),
    );
    setEditOpen(false);
    setEditingId(null);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.teacher_id !== id));
  };

  const fullName = (t: TeacherRecord) =>
    [t.first_name, t.middle_name, t.last_name].filter(Boolean).join(" ");

  const fullAddress = (t: TeacherRecord) =>
    [t.address_line1, t.address_line2, t.address_line3].filter(Boolean).join(", ");

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
                <h1 className="text-3xl font-bold">Teachers</h1>
              </div>
              <Button onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Teacher
              </Button>
            </div>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Teacher ID</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Teacher Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No teachers yet. Click "Add Teacher" to add one.
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((t) => (
                      <TableRow key={t.teacher_id}>
                        <TableCell>{t.teacher_id}</TableCell>
                        <TableCell>{t.user_id}</TableCell>
                        <TableCell>{fullName(t)}</TableCell>
                        <TableCell>{fullAddress(t)}</TableCell>
                        <TableCell>{t.age}</TableCell>
                        <TableCell className="space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditOpen(t)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(t.teacher_id)}>
                            <Trash className="h-4 w-4 mr-1" /> Delete
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
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>Enter the teacher details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <Input placeholder="First Name" value={form.first_name} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} />
                <Input placeholder="Middle Name" value={form.middle_name} onChange={(e) => setForm((p) => ({ ...p, middle_name: e.target.value }))} />
                <Input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))} />
                <Input placeholder="Address Line 1" value={form.address_line1} onChange={(e) => setForm((p) => ({ ...p, address_line1: e.target.value }))} />
                <Input placeholder="Address Line 2" value={form.address_line2} onChange={(e) => setForm((p) => ({ ...p, address_line2: e.target.value }))} />
                <Input placeholder="Address Line 3" value={form.address_line3} onChange={(e) => setForm((p) => ({ ...p, address_line3: e.target.value }))} />
                <Input placeholder="Age" type="number" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                <Button onClick={handleAdd}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Teacher</DialogTitle>
                <DialogDescription>Update the teacher details below.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <Input placeholder="First Name" value={form.first_name} onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))} />
                <Input placeholder="Middle Name" value={form.middle_name} onChange={(e) => setForm((p) => ({ ...p, middle_name: e.target.value }))} />
                <Input placeholder="Last Name" value={form.last_name} onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))} />
                <Input placeholder="Address Line 1" value={form.address_line1} onChange={(e) => setForm((p) => ({ ...p, address_line1: e.target.value }))} />
                <Input placeholder="Address Line 2" value={form.address_line2} onChange={(e) => setForm((p) => ({ ...p, address_line2: e.target.value }))} />
                <Input placeholder="Address Line 3" value={form.address_line3} onChange={(e) => setForm((p) => ({ ...p, address_line3: e.target.value }))} />
                <Input placeholder="Age" type="number" value={form.age} onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))} />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
                <Button onClick={handleEditSave}>Save</Button>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Teachers;
