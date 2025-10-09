import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Teacher = () => {
  // Initial dummy data
  const [teacherData, setTeacherData] = useState([
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
  ]);

  // Dialog + form state
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    address_line1: "",
    address_line2: "",
    address_line3: "",
    age: "",
  });

  // Add teacher handler
  const handleAddTeacher = () => {
    const teacherWithId = {
      teacher_id: `T${Date.now()}`,
      user_id: `U${Date.now()}`,
      ...newTeacher,
      age: Number(newTeacher.age),
    };

    setTeacherData((prev) => [...prev, teacherWithId]);
    setAddTeacherOpen(false);

    setNewTeacher({
      first_name: "",
      middle_name: "",
      last_name: "",
      address_line1: "",
      address_line2: "",
      address_line3: "",
      age: "",
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Teachers</h1>

      <div className="mb-4 flex justify-end">
        <Button onClick={() => setAddTeacherOpen(true)}>+ Add Teacher</Button>
      </div>

      {/* Teachers Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Teacher ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Middle Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Address Line 1</TableHead>
              <TableHead>Address Line 2</TableHead>
              <TableHead>Address Line 3</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherData.map((teacher) => (
              <TableRow key={teacher.teacher_id}>
                <TableCell>{teacher.teacher_id}</TableCell>
                <TableCell>{teacher.user_id}</TableCell>
                <TableCell>{teacher.first_name}</TableCell>
                <TableCell>{teacher.middle_name}</TableCell>
                <TableCell>{teacher.last_name}</TableCell>
                <TableCell>{teacher.address_line1}</TableCell>
                <TableCell>{teacher.address_line2}</TableCell>
                <TableCell>{teacher.address_line3}</TableCell>
                <TableCell>{teacher.age}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add Teacher Dialog */}
      <Dialog open={addTeacherOpen} onOpenChange={setAddTeacherOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>Enter teacher details below.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <Input
              placeholder="First Name"
              value={newTeacher.first_name}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, first_name: e.target.value }))
              }
            />
            <Input
              placeholder="Middle Name"
              value={newTeacher.middle_name}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, middle_name: e.target.value }))
              }
            />
            <Input
              placeholder="Last Name"
              value={newTeacher.last_name}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, last_name: e.target.value }))
              }
            />
            <Input
              placeholder="Address Line 1"
              value={newTeacher.address_line1}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, address_line1: e.target.value }))
              }
            />
            <Input
              placeholder="Address Line 2"
              value={newTeacher.address_line2}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, address_line2: e.target.value }))
              }
            />
            <Input
              placeholder="Address Line 3"
              value={newTeacher.address_line3}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, address_line3: e.target.value }))
              }
            />
            <Input
              placeholder="Age"
              type="number"
              value={newTeacher.age}
              onChange={(e) =>
                setNewTeacher((p) => ({ ...p, age: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setAddTeacherOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeacher}>Add Teacher</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Teacher;
