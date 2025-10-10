import { SidebarProvider } from "@/components/ui/sidebar";
import { TeacherSidebar } from "./TeacherSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Subject = { id: string; name: string };

const fallbackSubjects: Subject[] = [
  { id: "CS101", name: "Computer Science 101" },
  { id: "DB201", name: "Database Systems" },
  { id: "ALG110", name: "Algorithms" },
];

const AssessmentSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/teacher/subjects");
        if (!cancelled && res.ok) {
          const data = (await res.json()) as Subject[];
          if (Array.isArray(data) && data.length > 0) {
            setSubjects(data);
            return;
          }
        }
      } catch {}
      if (!cancelled) setSubjects(fallbackSubjects);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Assessment</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((s) => (
                <Card key={s.id} className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/teacher/assessment/${encodeURIComponent(s.id)}`)}>
                  <CardHeader>
                    <CardTitle className="text-xl">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Subject Code: {s.id}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AssessmentSubjects;
