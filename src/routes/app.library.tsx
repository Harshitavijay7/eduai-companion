import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStoredDocs, removeStoredDoc } from "@/lib/docs";
import { motion } from "framer-motion";
import { Library as LibIcon, Search, FileText, MessageSquare, Layers, Trash2, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/library")({
  component: Library,
  head: () => ({ meta: [{ title: "My Library — IntelliLearn AI" }] }),
});

const docs = [
  { id: "1", name: "Machine Learning Textbook", subject: "AI/ML", pages: 342, updated: "2 days ago", color: "from-violet-500 to-fuchsia-500" },
  { id: "2", name: "DBMS Complete Notes", subject: "Databases", pages: 128, updated: "5 hours ago", color: "from-cyan-500 to-blue-500" },
  { id: "3", name: "Operating Systems", subject: "OS", pages: 210, updated: "Yesterday", color: "from-indigo-500 to-violet-500" },
  { id: "4", name: "Computer Networks", subject: "CN", pages: 176, updated: "3 days ago", color: "from-emerald-500 to-teal-500" },
  { id: "5", name: "TOC — Theory of Computation", subject: "Theory", pages: 98, updated: "1 week ago", color: "from-amber-500 to-orange-500" },
  { id: "6", name: "Compiler Design", subject: "Compilers", pages: 220, updated: "1 week ago", color: "from-pink-500 to-rose-500" },
];

type LibDoc = { id: string; name: string; subject: string; pages?: number; size?: string; updated: string; color: string; stored?: boolean };

function Library() {
  const [q, setQ] = useState("");
  const [stored, setStored] = useState<LibDoc[]>([]);
  useEffect(() => {
    setStored(
      getStoredDocs().map((d) => ({
        id: d.id,
        name: d.name,
        subject: d.subject,
        size: d.size,
        updated: new Date(d.uploadedAt).toLocaleDateString(),
        color: d.color,
        stored: true,
      })),
    );
  }, []);
  const all: LibDoc[] = [...stored, ...docs];
  const filtered = all.filter((d) => d.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader
        title="My Library"
        subtitle={`${all.length} documents ready to study`}
        icon={LibIcon}
        actions={
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search library…" className="pl-9 bg-card/60" />
          </div>
        }
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card className="glass group overflow-hidden p-0 transition hover:-translate-y-1 hover:glow">
              <div className={`relative h-32 bg-gradient-to-br ${d.color}`}>
                <FileText className="absolute right-4 top-4 h-6 w-6 text-white/80" />
                <div className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-white/90">{d.subject}</div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-semibold">{d.name}</h3>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{d.pages ? `${d.pages} pages` : d.size}</Badge>
                  <span>· {d.updated}</span>
                </div>
                <div className="mt-4 flex gap-1.5">
                  <Button asChild size="sm" className="h-8 flex-1 gradient-bg text-white"><Link to="/app/chat"><MessageSquare className="mr-1 h-3.5 w-3.5" />Chat</Link></Button>
                  <Button asChild size="sm" variant="outline" className="h-8"><Link to="/app/flashcards"><Layers className="h-3.5 w-3.5" /></Link></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { if (d.stored) { removeStoredDoc(d.id); setStored((s) => s.filter((x) => x.id !== d.id)); } }}><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
