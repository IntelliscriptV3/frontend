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
import { Input } from "@/components/ui/input";

type AttendanceItem = {
  attendance_id: string;
  student_id: string;
  course_id: string;
  attendance_date: string;
  status: string;
  remarks: string;
  created_at: string;
};

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [filters, setFilters] = useState({
    attendance_id: "",
    student_id: "",
    course_id: "",
    attendance_date: "",
    status: "",
    remarks: "",
  });

  const filteredData = attendanceData.filter((item) => {
    return (
      item.attendance_id.toLowerCase().includes(filters.attendance_id.toLowerCase()) &&
      item.student_id.toLowerCase().includes(filters.student_id.toLowerCase()) &&
      item.course_id.toLowerCase().includes(filters.course_id.toLowerCase()) &&
      item.attendance_date.toLowerCase().includes(filters.attendance_date.toLowerCase()) &&
      item.status.toLowerCase().includes(filters.status.toLowerCase()) &&
      item.remarks.toLowerCase().includes(filters.remarks.toLowerCase())
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Attendance</h1>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Attendance ID</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.attendance_id}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, attendance_id: e.target.value }))
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
                          value={filters.student_id}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, student_id: e.target.value }))
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
                          value={filters.course_id}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, course_id: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Attendance Date</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.attendance_date}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, attendance_date: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Status</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.status}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, status: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Remarks</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.remarks}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, remarks: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Created At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No attendance records yet. Data will appear here when added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.attendance_id}>
                        <TableCell>{item.attendance_id}</TableCell>
                        <TableCell>{item.student_id}</TableCell>
                        <TableCell>{item.course_id}</TableCell>
                        <TableCell>{item.attendance_date}</TableCell>
                        <TableCell>{item.status}</TableCell>
                        <TableCell>{item.remarks}</TableCell>
                        <TableCell>{item.created_at}</TableCell>
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

export default Attendance;
