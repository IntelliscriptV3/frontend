import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dummyAssessments = [
  { id: "A001", title: "Midterm Exam", description: "Comprehensive midterm examination", maxMarks: 100, date: "2025-01-15" },
  { id: "A002", title: "Quiz 1", description: "Chapter 1-3 quiz", maxMarks: 20, date: "2025-01-22" },
  { id: "A003", title: "Project", description: "Final semester project", maxMarks: 50, date: "2025-02-10" },
];

const dummyResults = [
  { assessmentId: "A001", marksObtained: 85, gradedDateTime: "2025-01-16 10:30 AM" },
  { assessmentId: "A002", marksObtained: 18, gradedDateTime: "2025-01-23 02:15 PM" },
];

const StudentCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate("/student/assessment")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
            
            <h1 className="text-3xl font-bold mb-6">Course: {courseId}</h1>

            {/* Assessment Table */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Assessments</h2>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Maximum Marks</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyAssessments.map((assessment) => (
                      <TableRow key={assessment.id}>
                        <TableCell>{assessment.id}</TableCell>
                        <TableCell className="font-medium">{assessment.title}</TableCell>
                        <TableCell>{assessment.description}</TableCell>
                        <TableCell>{assessment.maxMarks}</TableCell>
                        <TableCell>{assessment.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Assessment Results Table */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Assessment Results</h2>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assessment ID</TableHead>
                      <TableHead>Marks Obtained</TableHead>
                      <TableHead>Graded Date & Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dummyResults.map((result) => (
                      <TableRow key={result.assessmentId}>
                        <TableCell>{result.assessmentId}</TableCell>
                        <TableCell className="font-medium">{result.marksObtained}</TableCell>
                        <TableCell>{result.gradedDateTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default StudentCourse;
