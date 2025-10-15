import React, { useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Tile: React.FC<{ title: string; description?: string; onClick: () => void }> = ({ title, description, onClick }) => {
  return (
    <div className="w-full sm:w-1/2 p-2">
      <Card className="cursor-pointer hover:shadow-lg" onClick={onClick}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description ?? `Upload ${title} file`}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Uploads: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "";

  const handlePick = (type: string) => {
    if (!inputRef.current) return;
    // attach the type on the input dataset so the change handler knows which tile triggered it
    inputRef.current.dataset.type = type;
    inputRef.current.click();
  };

  const uploadFiles = async (files: FileList, type: string) => {
    const names = Array.from(files).map((f) => f.name).join(", ");

    // show an uploading toast and keep its handlers
    const t = toast({ title: `Uploading ${type}...`, description: names });

    try {
      const fd = new FormData();
      // append all files (backend should accept multiple files under the same field)
      Array.from(files).forEach((f) => fd.append("files", f));
      fd.append("type", type);

      const res = await fetch(`${API_BASE}/api/uploads`, {
        method: "POST",
        // DO NOT set Content-Type; browser will set the multipart boundary
        body: fd,
        credentials: "include",
      });

      if (!res.ok) {
        const text = await res.text();
        t.update({ id: t.id, title: `Upload failed`, description: `${res.status} ${res.statusText}: ${text}` });
        return;
      }

      const data = await res.json().catch(() => null);
      t.update({ id: t.id, title: `Uploaded ${type}`, description: data?.message || `Uploaded ${names}` });
    } catch (err: any) {
      t.update({ id: t.id, title: `Upload error`, description: err?.message || String(err) });
    }
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    const type = e.currentTarget.dataset.type ?? "file";
    if (!files || files.length === 0) {
      toast({ title: "No file selected", description: "Please select a file to upload." });
      return;
    }

    // send files to backend
    void uploadFiles(files, type);

    // reset input so same file can be picked again if needed
    e.currentTarget.value = "";
    delete e.currentTarget.dataset.type;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Uploads</h2>

      <div className="flex flex-wrap -m-2">
        <Tile title="Rules" description="Upload rules document (PDF, DOCX)" onClick={() => handlePick("Rules")} />
        <Tile title="Notices" description="Upload notices (PDF, DOCX, images)" onClick={() => handlePick("Notices")} />
      </div>

      {/* hidden file input used by both tiles */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  );
};

export default Uploads;
