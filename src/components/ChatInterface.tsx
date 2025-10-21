import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Attachment {
  url: string;
  filename?: string;
  contentType?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
}

const imageUrlRe = /(https?:\/\/[\w\-./?%&=+:#]+\.(?:png|jpg|jpeg|gif|webp|svg))(?:\?|$)/gi;
const urlRe = /(https?:\/\/[\w\-./?%&=+:#]+)/gi;

async function downloadFile(url: string, filename?: string) {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error(`Failed to download (${res.status})`);
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename || url.split("/").pop() || "file";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);
}

const AttachmentView: React.FC<{ att: Attachment }> = ({ att }) => {
  const { toast } = useToast();
  const isImage = att.contentType?.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg)$/i.test(att.url);

  return (
    <div className="mt-3">
      {isImage ? (
        <a href={att.url} target="_blank" rel="noreferrer">
          <img src={att.url} alt={att.filename || "image"} className="max-w-full max-h-64 rounded-md object-contain" />
        </a>
      ) : (
        <div className="flex items-center gap-3 p-2 border rounded">
          <div className="flex-1 truncate">{att.filename || att.url}</div>
          <Button
            size="sm"
            onClick={async () => {
              try {
                await downloadFile(att.url, att.filename);
              } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                toast({ title: "Download failed", description: message });
              }
            }}
          >
            <Download className="h-4 w-4 mr-2" /> Download
          </Button>
        </div>
      )}
    </div>
  );
};

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    setInput("");

    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is a placeholder response. Backend integration pending.",
        },
      ]);
    }, 500);
  };

  const renderContentWithLinks = (text: string) => {
    // Replace URLs with anchor tags while preserving text. We'll do a simple split by urlRe
    const parts: Array<string | JSX.Element> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    const re = new RegExp(urlRe);
    while ((match = re.exec(text)) !== null) {
      const url = match[0];
      const start = match.index;
      if (start > lastIndex) parts.push(text.slice(lastIndex, start));
      parts.push(
        <a key={start} href={url} target="_blank" rel="noreferrer" className="underline">
          {url}
        </a>,
      );
      lastIndex = start + url.length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return <p className="whitespace-pre-wrap">{parts}</p>;
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
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
                      : "bg-card border border-border text-card-foreground"
                  }`}
                >
                  {renderContentWithLinks(message.content)}

                  {/* render inline images referenced by URLs inside content */}
                  {Array.from((message.content || "").matchAll(imageUrlRe)).map((m, i) => (
                    <div key={i} className="mt-3">
                      <a href={m[1]} target="_blank" rel="noreferrer">
                        <img src={m[1]} alt="image" className="max-w-full max-h-64 rounded-md object-contain" />
                      </a>
                    </div>
                  ))}

                  {/* render attachments if any */}
                  {message.attachments?.map((att, i) => (
                    <AttachmentView key={i} att={att} />
                  ))}
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
