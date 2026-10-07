import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Copy, Sparkles, RefreshCw, Loader2, AlertCircle, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { IntelliLearnAPI } from "@/lib/api";
import { getStoredDocs, type StoredDoc } from "@/lib/docs";
import { toast } from "sonner";

export const Route = createFileRoute("/app/notes")({
  component: Notes,
  head: () => ({
    meta: [
      { title: "AI Notes — IntelliLearn AI" },
      { name: "description", content: "Generate clear study notes from your uploaded PDFs." },
      { property: "og:title", content: "AI Notes — IntelliLearn AI" },
      { property: "og:description", content: "Generate clear study notes from your uploaded PDFs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function Notes() {
  const [docs, setDocs] = useState<StoredDoc[]>([]);
  const [docId, setDocId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    const ready = getStoredDocs().filter((d) => d.fileName);
    setDocs(ready);
    const fromUrl = new URLSearchParams(window.location.search).get("doc");
    const initial = ready.find((d) => d.id === fromUrl) ?? ready[0];
    if (initial) setDocId(initial.id);
  }, []);

  const doc = docs.find((d) => d.id === docId);
  const output = doc ? notes[doc.id] : undefined;

  const generate = async () => {
    if (!doc?.fileName || loading) return;
    setLoading(true);
    setError(null);
    try {
      const data = await IntelliLearnAPI.notes(doc.fileName);
      if (data.success === false || typeof data.notes !== "string" || !data.notes.trim()) {
        throw new Error(data.message || "empty");
      }
      setNotes((n) => ({ ...n, [doc.id]: data.notes as string }));
      toast.success("Notes generated");
    } catch (err) {
      setError(friendlyAIError(err));
      toast.error("Couldn't generate notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageHeader title="AI Notes" subtitle="Turn any PDF into perfectly structured notes." icon={FileText} />

      <Card className="glass mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <div className="mb-1.5 text-sm font-medium">Source Document</div>
            <Select value={docId} onValueChange={(v) => { setDocId(v); setError(null); }} disabled={!docs.length || loading}>
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
          <Button className="gradient-bg text-white glow" onClick={generate} disabled={!doc || loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : output ? <RefreshCw className="mr-1 h-4 w-4" /> : <Sparkles className="mr-1 h-4 w-4" />}
            {loading ? "Generating…" : output ? "Regenerate Notes" : "Generate Notes"}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="mb-6 flex items-start gap-3 border-destructive/50 bg-destructive/10 p-4 text-sm">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <div className="flex-1">{error}</div>
          <Button size="sm" variant="outline" onClick={generate} disabled={loading}>Try again</Button>
        </Card>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
              <div className="font-medium">Reading your PDF and writing notes…</div>
              <div className="text-sm text-muted-foreground">This can take up to a minute for long documents.</div>
            </div>
          ) : output ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <Badge className="gradient-bg text-white">Study Notes</Badge>
                  <span className="truncate text-xs text-muted-foreground">{doc?.displayName || doc?.name}</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}>
                  <Copy className="mr-1 h-3.5 w-3.5" />Copy
                </Button>
              </div>
              <div className="md-content rounded-xl border border-border/60 bg-card/30 p-6 text-[0.95rem]">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-bg glow">
                <FileText className="h-6 w-6 text-white" />
              </div>
              {docs.length ? (
                <>
                  <div className="font-semibold">No notes yet</div>
                  <p className="max-w-sm text-sm text-muted-foreground">Pick a PDF above and click Generate Notes to get clear, revision-ready study notes.</p>
                </>
              ) : (
                <>
                  <div className="font-semibold">Upload a PDF to get started</div>
                  <p className="max-w-sm text-sm text-muted-foreground">Notes can be made from PDFs you upload. Older uploads may need to be uploaded again.</p>
                  <Button asChild variant="outline" size="sm"><Link to="/app/upload"><Upload className="mr-1 h-3.5 w-3.5" />Upload PDF</Link></Button>
                </>
              )}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
