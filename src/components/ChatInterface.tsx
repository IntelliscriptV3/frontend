import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Download } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
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
  const isImage =
    att.contentType?.startsWith("image/") ||
    /^data:image/i.test(att.url) ||
    /\.(png|jpe?g|gif|webp|svg)$/i.test(att.url);

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Use Vite env var VITE_API_BASE or fallback to localhost backend
  const API_BASE = ((import.meta as any)?.env?.VITE_API_BASE as string) || "http://localhost:8000";

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    try {
      const el = scrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    } catch (e) {
      // ignore
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

  const userText = input;
    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      // Call the backend classify endpoint (GET) with query params
  const role = (typeof window !== "undefined" && localStorage.getItem("user_role")) || "student";
  const url = `${API_BASE.replace(/\/$/, "")}/chat/classify?user_query=${encodeURIComponent(userText)}&user_id=1&user_role=${encodeURIComponent(role)}`;
      const res = await fetch(url, { credentials: "include" });

      if (!res.ok) {
        const text = await res.text();
        toast({ title: "Backend error", description: `Status ${res.status}: ${text}` });
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error from backend (status ${res.status}).` },
        ]);
        return;
      }

      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        const text = await res.text();
        data = { response_text: text };
      }

      // The backend may return { response: {...} } where response.answer
      // contains the text/html (including a table and embedded data URLs).
      // Prefer that field when present so we don't end up rendering
      // "[object Object]" in the UI.
      const payload = data?.response ?? data ?? {};
      let assistantText: any;
      if (payload && typeof payload === "object" && "answer" in payload) {
        assistantText = payload.answer;
      } else if (typeof payload === "string") {
        assistantText = payload;
      } else if (typeof data === "object" && data !== null && Object.keys(data).length === 1 && typeof Object.values(data)[0] === "string") {
        assistantText = Object.values(data)[0] as any;
      } else {
        assistantText = JSON.stringify(payload);
      }

      // If backend provided figures as an array (base64 data URIs or raw base64),
      // attach them so the UI can render images. We support items that are:
      // - full data URI (data:image/png;base64,...)
      // - plain base64 (we assume PNG)
      // - http(s) URLs
      const attachments: Attachment[] = [];
      if (payload && Array.isArray(payload.figures)) {
        for (const f of payload.figures) {
          if (!f) continue;
          let url = String(f);
          if (/^data:/i.test(url) || url.startsWith("http://") || url.startsWith("https://")) {
            // use as-is
          } else {
            // assume raw base64 -> prefix with image/png
            url = `data:image/png;base64,${url}`;
          }
          attachments.push({ url });
        }
      }

      // Deduplicate: if the assistantText embeds the same image (markdown or <img>)
      // that we're also returning as an attachment, strip the inline image markup
      // so the UI only shows the attachment once.
      const attachmentUrls = new Set(attachments.map((a) => a.url));
      let cleanedText = String(assistantText || "");

      if (cleanedText) {
        // Remove markdown image syntax that references an attachment URL
        cleanedText = cleanedText.replace(/!\[[^\]]*\]\(([^)]+)\)/g, (m, src) => {
          try {
            const s = String(src || "");
            // normalize raw base64 -> data: prefix for comparison
            const norm = /^data:/i.test(s) || s.startsWith("http://") || s.startsWith("https://") ? s : `data:image/png;base64,${s}`;
            return attachmentUrls.has(norm) ? "" : m;
          } catch (e) {
            return m;
          }
        });

        // Remove HTML <img src="..."> tags that reference an attachment URL
        cleanedText = cleanedText.replace(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi, (m, src) => {
          try {
            const s = String(src || "");
            const norm = /^data:/i.test(s) || s.startsWith("http://") || s.startsWith("https://") ? s : `data:image/png;base64,${s}`;
            return attachmentUrls.has(norm) ? "" : m;
          } catch (e) {
            return m;
          }
        });
      }

      setMessages((prev) => [...prev, { role: "assistant", content: cleanedText, attachments: attachments.length ? attachments : undefined }]);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ title: "Network error", description: message });
      setMessages((prev) => [...prev, { role: "assistant", content: `Network error: ${message}` }]);
    } finally {
      setLoading(false);
    }
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

  const looksLikeHtmlOrMarkdown = (text: string) => {
    if (!text) return false;
    const lowered = text.toLowerCase();
    return (
      lowered.includes("<table") ||
      lowered.includes("<img") ||
      lowered.includes("data:image") ||
      /!\[.*\]\(/.test(text) ||
      /^#{1,6}\s+/m.test(text) ||
      lowered.includes("<div")
    );
  };

  const markdownLikeToHtml = (text: string) => {
    if (!text) return "";
    let html = text;

    // Convert markdown image syntax for data URLs and normal URLs to <img>
    html = html.replace(/!\[([^\]]*)\]\((data:image[^)]+)\)/g, (_m, alt, src) => {
      return `<img src="${src}" alt="${alt || "image"}" style="max-width:100%;height:auto;border-radius:6px"/>`;
    });
    html = html.replace(/!\[([^\]]*)\]\((https?:[^)]+)\)/g, (_m, alt, src) => {
      return `<img src="${src}" alt="${alt || "image"}" style="max-width:100%;height:auto;border-radius:6px"/>`;
    });

    // Convert headers like ### Header
    html = html.replace(/^######\s+(.*)$/gm, "<h6>$1</h6>");
    html = html.replace(/^#####\s+(.*)$/gm, "<h5>$1</h5>");
    html = html.replace(/^####\s+(.*)$/gm, "<h4>$1</h4>");
    html = html.replace(/^###\s+(.*)$/gm, "<h3>$1</h3>");
    html = html.replace(/^##\s+(.*)$/gm, "<h2>$1</h2>");
    html = html.replace(/^#\s+(.*)$/gm, "<h1>$1</h1>");

    // Horizontal rules
    html = html.replace(/^---$/gm, "<hr/>");

    // Preserve paragraphs and breaks
    html = html.replace(/\n\n+/g, "</p><p>");
    html = `<p>${html}</p>`;

    // Convert simple links to anchors
    html = html.replace(/(https?:\/\/[\w\-./?%&=+:#]+)/g, "<a href='$1' target='_blank' rel='noreferrer'>$1</a>");

    return html;
  };

  const parseTableFromHtmlOrText = (text: string) => {
    // Try HTML table first
    try {
      if (text.includes("<table")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");
        const table = doc.querySelector("table");
        if (table) {
          const headers: string[] = [];
          const headerEls = table.querySelectorAll("thead th");
          if (headerEls.length > 0) {
            headerEls.forEach((h) => headers.push(h.textContent?.trim() || ""));
          } else {
            // try first row as header
            const firstRow = table.querySelector("tr");
            if (firstRow) {
              firstRow.querySelectorAll("td,th").forEach((h) => headers.push(h.textContent?.trim() || ""));
            }
          }

          const rows: string[][] = [];
          const bodyRows = table.querySelectorAll("tbody tr");
          if (bodyRows.length > 0) {
            bodyRows.forEach((r) => {
              const cols: string[] = [];
              r.querySelectorAll("td").forEach((c) => cols.push(c.textContent?.trim() || ""));
              rows.push(cols);
            });
          } else {
            // fallback to all rows
            table.querySelectorAll("tr").forEach((r, idx) => {
              // skip header row if we used it
              if (idx === 0 && headerEls.length === 0) return;
              const cols: string[] = [];
              r.querySelectorAll("td").forEach((c) => cols.push(c.textContent?.trim() || ""));
              if (cols.length) rows.push(cols);
            });
          }

          return { headers, rows };
        }
      }
    } catch (e) {
      // ignore parsing errors
    }

    // Try pipe-separated plain text table (markdown-like)
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const pipeLines = lines.filter((l) => l.includes("|") && /\|/.test(l));
    if (pipeLines.length >= 2) {
      // assume first line headers, optional separator line second
      let start = 0;
      const headers = pipeLines[0].split("|").map((h) => h.trim()).filter(Boolean);
      if (pipeLines[1].match(/^[-\s|:]+$/)) start = 2;
      const rows: string[][] = [];
      for (let i = start; i < pipeLines.length; i++) {
        const cols = pipeLines[i].split("|").map((c) => c.trim()).filter(Boolean);
        if (cols.length) rows.push(cols);
      }
      return { headers, rows };
    }

    return null;
  };

  const renderSimpleBarChart = (rows: string[][], headers: string[]) => {
    // Create a simple count by status chart. Look for a "status" column (case-insensitive)
    const statusIdx = headers.findIndex((h) => /status/i.test(h));
    const dateIdx = headers.findIndex((h) => /date/i.test(h));
    const counts: Record<string, number> = {};
    if (statusIdx >= 0) {
      rows.forEach((r) => {
        const s = (r[statusIdx] || "").toLowerCase();
        counts[s] = (counts[s] || 0) + 1;
      });
    } else if (dateIdx >= 0) {
      // fallback: count per date
      rows.forEach((r) => {
        const d = r[dateIdx] || "";
        counts[d] = (counts[d] || 0) + 1;
      });
    } else {
      // try last column as status
      rows.forEach((r) => {
        const s = (r[r.length - 1] || "").toLowerCase();
        counts[s] = (counts[s] || 0) + 1;
      });
    }

    const labels = Object.keys(counts);
    const values = labels.map((l) => counts[l]);
    const max = Math.max(...values, 1);

    // simple SVG horizontal bars
    const barHeight = 20;
    const gap = 8;
    const width = 360;
    const height = labels.length * (barHeight + gap);

    return (
      <svg width={width} height={height} className="my-3">
        {labels.map((label, i) => {
          const val = values[i];
          const barW = Math.round((val / max) * (width - 120));
          const y = i * (barHeight + gap);
          return (
            <g key={label} transform={`translate(0, ${y})`}>
              <text x={0} y={barHeight - 6} fontSize={12} fill="#111">{label}</text>
              <rect x={120} y={0} width={barW} height={barHeight} fill="#4f46e5" rx={4} />
              <text x={120 + barW + 6} y={barHeight - 6} fontSize={12} fill="#111">{val}</text>
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <ScrollArea className="flex-1 p-6">
        <div ref={scrollRef} className="max-w-4xl mx-auto space-y-6">
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
                  {looksLikeHtmlOrMarkdown(message.content) ? (
                    (() => {
                      const parsed = parseTableFromHtmlOrText(message.content || "");
                      if (parsed && parsed.headers.length && parsed.rows.length) {
                        // If the backend already provided a chart (as an attachment or
                        // embedded data URI), prefer that and skip our local chart.
                        const hasRemoteChart = (message.attachments || []).some((a) => /^(data:image|https?:\/\/)/i.test(a.url)) || /data:image\//i.test(message.content || "") || /!\[.*\]\(data:image/i.test(message.content || "");
                        const remainder = (message.content || "").replace(/<table[\s\S]*<\/table>/i, "").trim();
                        return (
                          <div>
                            {!hasRemoteChart ? renderSimpleBarChart(parsed.rows, parsed.headers) : null}
                            <div className="overflow-auto rounded-md border mt-2">
                              <table className="min-w-full text-sm">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {parsed.headers.map((h, i) => (
                                      <th key={i} className="px-3 py-2 text-left font-medium">{h}</th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {parsed.rows.map((r, ri) => (
                                    <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                      {r.map((c, ci) => (
                                        <td key={ci} className="px-3 py-2 align-top">{c}</td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            {remainder ? (
                              <div
                                className="mt-3 prose max-w-full"
                                dangerouslySetInnerHTML={{ __html: markdownLikeToHtml(remainder) }}
                              />
                            ) : null}
                          </div>
                        );
                      }
                      return (
                        <div
                          className="mt-2 prose max-w-full"
                          // Note: for a production app you should sanitize HTML before
                          // inserting it (this is a minimal change to get visuals working).
                          dangerouslySetInnerHTML={{ __html: markdownLikeToHtml(message.content) }}
                        />
                      );
                    })()
                  ) : (
                    <>
                      {renderContentWithLinks(message.content)}

                      {/* render inline images referenced by URLs inside content */}
                      {Array.from((message.content || "").matchAll(imageUrlRe)).map((m, i) => (
                        <div key={i} className="mt-3">
                          <a href={m[1]} target="_blank" rel="noreferrer">
                            <img src={m[1]} alt="image" className="max-w-full max-h-64 rounded-md object-contain" />
                          </a>
                        </div>
                      ))}
                    </>
                  )}

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
            disabled={loading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!loading) handleSend();
              }
            }}
            placeholder="Type your message..."
            className="resize-none bg-background"
            rows={3}
          />
          <Button
            onClick={handleSend}
            size="icon"
            disabled={loading}
            className="h-auto w-16 bg-gradient-to-br from-primary to-secondary hover:opacity-90"
          >
            <Send className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
};