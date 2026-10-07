import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Upload } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getStoredDocs, type StoredDoc } from "@/lib/docs";

/** Loads uploaded PDFs that are ready for AI (have a server file name), preselecting ?doc=<id>. */
export function useReadyDocs() {
  const [docs, setDocs] = useState<StoredDoc[]>([]);
  const [docId, setDocId] = useState("");
  useEffect(() => {
    const ready = getStoredDocs().filter((d) => d.fileName);
    setDocs(ready);
    const fromUrl = new URLSearchParams(window.location.search).get("doc");
    const initial = ready.find((d) => d.id === fromUrl) ?? ready[0];
    if (initial) setDocId(initial.id);
  }, []);
  return { docs, docId, setDocId, doc: docs.find((d) => d.id === docId) };
}

export function PdfSelect({
  docs, value, onChange, disabled,
}: { docs: StoredDoc[]; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 text-sm font-medium">Source PDF</div>
      <Select value={value} onValueChange={onChange} disabled={!docs.length || disabled}>
        <SelectTrigger className="bg-card/40">
          <SelectValue placeholder={docs.length ? "Choose a PDF" : "No uploaded PDFs ready yet"} />
        </SelectTrigger>
        <SelectContent>
          {docs.map((d) => (
            <SelectItem key={d.id} value={d.id}>{d.displayName || d.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function UploadPrompt() {
  return (
    <Button asChild variant="outline" size="sm">
      <Link to="/app/upload"><Upload className="mr-1 h-3.5 w-3.5" />Upload PDF</Link>
    </Button>
  );
}
