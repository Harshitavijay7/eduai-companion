import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { IntelliLearnAPI } from "@/lib/api";
import { addStoredDoc, getStoredDocs, removeStoredDoc, type StoredDoc } from "@/lib/docs";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, FileText, X, Eye, Trash2, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload PDF — IntelliLearn AI" }] }),
});

type Item = { id: string; name: string; size: string; progress: number; done: boolean; docId?: string };

const MAX_BYTES = 50 * 1024 * 1024;
const COLORS = [
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-500",
  "from-indigo-500 to-violet-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-pink-500 to-rose-500",
];

function UploadPage() {
  const [drag, setDrag] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    setItems(
      getStoredDocs().map((d) => ({ id: d.id, docId: d.id, name: d.displayName || d.name, size: d.size || "", progress: 100, done: true })),
    );
  }, []);

  const addFiles = useCallback((files: FileList | File[]) => {
    const all = Array.from(files);
    const pdfs = all.filter((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfs.length) return toast.error("Please choose a PDF file.");
    const arr = pdfs.filter((f) => {
      if (f.size > MAX_BYTES) {
        toast.error(`${f.name} is larger than 50 MB.`);
        return false;
      }
      return true;
    });
    arr.forEach(async (f) => {
      const id = crypto.randomUUID();
      const size = `${(f.size / 1024 / 1024).toFixed(1)} MB`;
      setItems((prev) => [{ id, name: f.name, size, progress: 0, done: false }, ...prev]);
      try {
        const data = await IntelliLearnAPI.upload(f);
        const doc: StoredDoc = {
          id,
          name: (data.displayName || f.name).replace(/\.pdf$/i, ""),
          subject: "PDF",
          size,
          uploadedAt: new Date().toISOString(),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          fileName: data.fileName,
          fileUri: data.fileUri,
          mimeType: data.mimeType,
          displayName: data.displayName || f.name,
          state: data.state,
        };
        addStoredDoc(doc);
        setItems((prev) => prev.map((x) => (x.id === id ? { ...x, progress: 100, done: true, docId: id } : x)));
        toast.success(`${f.name} uploaded`);
      } catch (err) {
        setItems((prev) => prev.filter((x) => x.id !== id));
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error(`Couldn't upload ${f.name}. ${msg}`);
      }
    });
  }, []);

  return (
    <div>
      <PageHeader title="Upload PDFs" subtitle="Drop your study material to start chatting, note-making, and quizzing." icon={UploadIcon} />

      <Card
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
        className={`glass relative flex min-h-72 flex-col items-center justify-center gap-4 border-2 border-dashed p-10 text-center transition ${drag ? "border-brand glow scale-[1.01]" : "border-border"}`}
      >
        <motion.div animate={{ y: drag ? -6 : 0 }} className="grid h-16 w-16 place-items-center rounded-2xl gradient-bg glow">
          <UploadIcon className="h-7 w-7 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-semibold">Drag & drop your PDFs here</h3>
          <p className="mt-1 text-sm text-muted-foreground">or click to browse — up to 50 MB each</p>
        </div>
        <label>
          <input type="file" className="hidden" accept="application/pdf" multiple onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <span className="inline-flex cursor-pointer items-center rounded-md gradient-bg px-5 py-2 text-sm font-medium text-white">Choose files</span>
        </label>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <Badge variant="outline">.pdf</Badge>
          <Badge variant="outline">OCR supported</Badge>
          <Badge variant="outline">Encrypted at rest</Badge>
        </div>
      </Card>

      <Card className="glass mt-6 p-6">
        <h3 className="mb-4 font-semibold">Recent Uploads</h3>
        <ul className="space-y-3">
          <AnimatePresence>
            {items.map((it) => (
              <motion.li
                key={it.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 rounded-xl border border-border/60 bg-card/40 p-4"
              >
                <div className="grid h-11 w-11 place-items-center rounded-lg gradient-bg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{it.name}</span>
                    {it.done && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-400" />}
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{it.size}</span>
                    {it.done ? <span>Ready</span> : <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" />Uploading…</span>}
                  </div>
                  {!it.done && <Progress value={undefined} className="mt-2 h-1.5 animate-pulse" />}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" title="Preview"><Eye className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" title="Remove" disabled={!it.done} onClick={() => { if (it.docId) removeStoredDoc(it.docId); setItems((p) => p.filter((x) => x.id !== it.id)); }}>
                    {it.done ? <Trash2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  </Button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Card>
    </div>
  );
}
