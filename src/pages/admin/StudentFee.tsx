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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FeeItem = {
  fee_id: string;
  student_id: string;
  course_id: string;
  month_year: string;
  amount: number;
  paid: string;
  paid_at: string;
  payment_method: string;
};

const StudentFee = () => {
  const [feeData, setFeeData] = useState<FeeItem[]>([]);
  const [filters, setFilters] = useState({
    fee_id: "",
    student_id: "",
    course_id: "",
    month_year: "",
  });

  const handleCellEdit = (feeId: string, field: keyof FeeItem, value: string) => {
    setFeeData((prev) =>
      prev.map((item) =>
        item.fee_id === feeId ? { ...item, [field]: value } : item
      )
    );
    console.log(`Updating ${field} for ${feeId} to:`, value);
    // TODO: Implement backend update
  };

  const filteredData = feeData.filter((item) => {
    return (
      item.fee_id.toLowerCase().includes(filters.fee_id.toLowerCase()) &&
      item.student_id.toLowerCase().includes(filters.student_id.toLowerCase()) &&
      item.course_id.toLowerCase().includes(filters.course_id.toLowerCase()) &&
      item.month_year.toLowerCase().includes(filters.month_year.toLowerCase())
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Student Fee</h1>

            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Fee ID</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.fee_id}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, fee_id: e.target.value }))
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
                        <div>Month/Year</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.month_year}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, month_year: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Paid At</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No fee records yet. Data will appear here when added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.fee_id}>
                        <TableCell>{item.fee_id}</TableCell>
                        <TableCell>{item.student_id}</TableCell>
                        <TableCell>{item.course_id}</TableCell>
                        <TableCell>{item.month_year}</TableCell>
                        <TableCell>{item.amount}</TableCell>
                        <TableCell>
                          <Select
                            value={item.paid}
                            onValueChange={(value) =>
                              handleCellEdit(item.fee_id, "paid", value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">Yes</SelectItem>
                              <SelectItem value="no">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="datetime-local"
                            value={item.paid_at}
                            onChange={(e) =>
                              handleCellEdit(item.fee_id, "paid_at", e.target.value)
                            }
                            className="h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.payment_method}
                            onChange={(e) =>
                              handleCellEdit(item.fee_id, "payment_method", e.target.value)
                            }
                            className="h-8"
                          />
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

export default StudentFee;
