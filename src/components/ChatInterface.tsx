import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    
    // Simulate response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "This is a placeholder response. Backend integration pending." 
      }]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Start a conversation...</p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                      : "bg-card border border-border text-card-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t border-border bg-card p-6">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message..."
            className="resize-none bg-background"
            rows={3}
          />
          <Button 
            onClick={handleSend}
            size="icon"
            className="h-auto w-16 bg-gradient-to-br from-primary to-secondary hover:opacity-90"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
