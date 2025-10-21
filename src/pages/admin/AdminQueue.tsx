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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Send, Forward, Search } from "lucide-react";

type PanelView = "queue" | "history";

type QueueItem = {
  queue_id: string;
  question: string;
  answer: string;
  answered_by: string;
  user_id: string;
  assigned_at: string;
  resolved_at: string;
};

type ChatHistoryItem = {
  chat_id: string;
  user_id: string;
  question: string;
  answer: string;
  status: string;
  date_time: string;
};

// Sample teachers data - replace with actual data from backend
const sampleTeachers = [
  { id: "T001", name: "John Smith" },
  { id: "T002", name: "Sarah Johnson" },
  { id: "T003", name: "Michael Brown" },
];

const AdminQueue = () => {
  const [activePanel, setActivePanel] = useState<PanelView>("queue");
  const [queueData, setQueueData] = useState<QueueItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [filters, setFilters] = useState({
    queue_id: "",
    question: "",
    answered_by: "",
    user_id: "",
  });
  const [historyFilters, setHistoryFilters] = useState({
    chat_id: "",
    user_id: "",
    question: "",
    answer: "",
    status: "",
    date_time: "",
  });
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [selectedQueueId, setSelectedQueueId] = useState<string>("");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const handleAnswerChange = (queueId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [queueId]: value }));
  };

  const handleSubmit = (queueId: string) => {
    console.log(`Submitting answer for queue ${queueId}:`, answers[queueId]);
    // TODO: Implement backend submission
  };

  const handleForwardClick = (queueId: string) => {
    setSelectedQueueId(queueId);
    setForwardDialogOpen(true);
  };

  const handleForwardSubmit = () => {
    console.log(`Forwarding queue ${selectedQueueId} to teacher ${selectedTeacher}`);
    // TODO: Implement backend forwarding
    setForwardDialogOpen(false);
    setSelectedTeacher("");
    setTeacherSearch("");
  };

  const filteredTeachers = sampleTeachers.filter(
    (teacher) =>
      teacher.id.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      teacher.name.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const filteredData = queueData.filter((item) => {
    return (
      item.queue_id.toLowerCase().includes(filters.queue_id.toLowerCase()) &&
      item.question.toLowerCase().includes(filters.question.toLowerCase()) &&
      item.answered_by.toLowerCase().includes(filters.answered_by.toLowerCase()) &&
      item.user_id.toLowerCase().includes(filters.user_id.toLowerCase())
    );
  });

  const filteredHistory = chatHistory.filter((item) => {
    return (
      item.chat_id.toLowerCase().includes(historyFilters.chat_id.toLowerCase()) &&
      item.user_id.toLowerCase().includes(historyFilters.user_id.toLowerCase()) &&
      item.question.toLowerCase().includes(historyFilters.question.toLowerCase()) &&
      item.answer.toLowerCase().includes(historyFilters.answer.toLowerCase()) &&
      item.status.toLowerCase().includes(historyFilters.status.toLowerCase()) &&
      item.date_time.toLowerCase().includes(historyFilters.date_time.toLowerCase())
    );
  });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Admin Queue</h1>

            {/* Panel Buttons */}
            <div className="flex gap-4 mb-6">
              <Button
                variant={activePanel === "queue" ? "default" : "outline"}
                onClick={() => setActivePanel("queue")}
                className="flex-1 h-12"
              >
                Admin Queue
              </Button>
              <Button
                variant={activePanel === "history" ? "default" : "outline"}
                onClick={() => setActivePanel("history")}
                className="flex-1 h-12"
              >
                Chat History
              </Button>
            </div>

            {/* Admin Queue Table */}
            {activePanel === "queue" && (
              <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Queue ID</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.queue_id}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, queue_id: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Question</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.question}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, question: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Actions</TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>Answered By</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.answered_by}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, answered_by: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="space-y-2">
                        <div>User ID</div>
                        <Input
                          placeholder="Filter..."
                          value={filters.user_id}
                          onChange={(e) =>
                            setFilters((prev) => ({ ...prev, user_id: e.target.value }))
                          }
                          className="h-8"
                        />
                      </div>
                    </TableHead>
                    <TableHead>Assigned At</TableHead>
                    <TableHead>Resolved At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No queue items yet. Data will appear here when added.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow key={item.queue_id}>
                        <TableCell>{item.queue_id}</TableCell>
                        <TableCell>{item.question}</TableCell>
                        <TableCell>
                          <Textarea
                            placeholder="Type answer here..."
                            value={answers[item.queue_id] || ""}
                            onChange={(e) => handleAnswerChange(item.queue_id, e.target.value)}
                            className="min-h-[80px]"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              onClick={() => handleSubmit(item.queue_id)}
                              title="Submit Answer"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              onClick={() => handleForwardClick(item.queue_id)}
                              title="Forward to Teacher"
                            >
                              <Forward className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{item.answered_by}</TableCell>
                        <TableCell>{item.user_id}</TableCell>
                        <TableCell>{item.assigned_at}</TableCell>
                        <TableCell>{item.resolved_at}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            )}

            {/* Chat History Table */}
            {activePanel === "history" && (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Chat ID</div>
                          <Input
                            placeholder="Filter..."
                            value={historyFilters.chat_id}
                            onChange={(e) =>
                              setHistoryFilters((prev) => ({ ...prev, chat_id: e.target.value }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>User ID</div>
                          <Input
                            placeholder="Filter..."
                            value={historyFilters.user_id}
                            onChange={(e) =>
                              setHistoryFilters((prev) => ({ ...prev, user_id: e.target.value }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Question</div>
                          <Input
                            placeholder="Filter..."
                            value={historyFilters.question}
                            onChange={(e) =>
                              setHistoryFilters((prev) => ({ ...prev, question: e.target.value }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Answer</div>
                          <Input
                            placeholder="Filter..."
                            value={historyFilters.answer}
                            onChange={(e) =>
                              setHistoryFilters((prev) => ({ ...prev, answer: e.target.value }))
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
                            value={historyFilters.status}
                            onChange={(e) =>
                              setHistoryFilters((prev) => ({ ...prev, status: e.target.value }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="space-y-2">
                          <div>Date/Time</div>
                          <Input
                            placeholder="Filter..."
                            value={historyFilters.date_time}
                            onChange={(e) =>
                              setHistoryFilters((prev) => ({ ...prev, date_time: e.target.value }))
                            }
                            className="h-8"
                          />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No chat history yet. Data will appear here when added.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredHistory.map((item) => (
                        <TableRow key={item.chat_id}>
                          <TableCell>{item.chat_id}</TableCell>
                          <TableCell>{item.user_id}</TableCell>
                          <TableCell>{item.question}</TableCell>
                          <TableCell>{item.answer}</TableCell>
                          <TableCell>{item.status}</TableCell>
                          <TableCell>{item.date_time}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>

        <Dialog open={forwardDialogOpen} onOpenChange={setForwardDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Forward Question to Teacher</DialogTitle>
              <DialogDescription>
                Select a teacher to forward this question to.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by ID or name..."
                  value={teacherSearch}
                  onChange={(e) => setTeacherSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <div className="border rounded-md max-h-[300px] overflow-y-auto">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher.id)}
                    className={`p-3 cursor-pointer border-b last:border-b-0 hover:bg-accent transition-colors ${
                      selectedTeacher === teacher.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="font-medium">{teacher.name}</div>
                    <div className="text-sm text-muted-foreground">{teacher.id}</div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleForwardSubmit}
                disabled={!selectedTeacher}
              >
                Forward Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  );
};

export default AdminQueue;
