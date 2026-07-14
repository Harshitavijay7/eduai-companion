import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History as HistoryIcon, Search, MessageSquare, FileText, ListChecks, Layers, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/history")({
  component: HistoryPage,
  head: () => ({ meta: [{ title: "History — IntelliLearn AI" }] }),
});

type Item = { id: string; title: string; source: string; time: string };

const data: Record<string, Item[]> = {
  chats: [
    { id: "1", title: "Explain backpropagation with an example", source: "ML_Book.pdf", time: "2h ago" },
    { id: "2", title: "Differences between B-tree and B+ tree", source: "DBMS_Notes.pdf", time: "Yesterday" },
    { id: "3", title: "TCP vs UDP scenarios", source: "Computer_Networks.pdf", time: "3d ago" },
  ],
  notes: [
    { id: "1", title: "Revision notes — Chapter 3", source: "ML_Book.pdf", time: "1d ago" },
    { id: "2", title: "Detailed notes — Normalization", source: "DBMS_Notes.pdf", time: "4d ago" },
  ],
  mcqs: [
    { id: "1", title: "20 MCQs · Medium · Neural Networks", source: "ML_Book.pdf", time: "3h ago" },
    { id: "2", title: "50 MCQs · Hard · SQL Joins", source: "DBMS_Notes.pdf", time: "5d ago" },
  ],
  flashcards: [
    { id: "1", title: "12 flashcards — Optimization", source: "ML_Book.pdf", time: "2d ago" },
  ],
};

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  chats: MessageSquare, notes: FileText, mcqs: ListChecks, flashcards: Layers,
};

function HistoryPage() {
  const [q, setQ] = useState("");

  const list = (key: keyof typeof data) => {
    const Icon = icons[key];
    return (
      <div className="grid gap-3">
        {data[key].filter((x) => x.title.toLowerCase().includes(q.toLowerCase())).map((x) => (
          <Card key={x.id} className="glass grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg gradient-bg"><Icon className="h-4 w-4 text-white" /></div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{x.title}</div>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-[10px]">{x.source}</Badge>
                <span>· {x.time}</span>
              </div>
            </div>
            <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4" /></Button>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div>
      <PageHeader
        title="History"
        subtitle="Everything you've generated, searchable and reusable."
        icon={HistoryIcon}
        actions={
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search history…" className="pl-9 bg-card/60" />
          </div>
        }
      />

      <Tabs defaultValue="chats">
        <TabsList className="glass mb-5">
          <TabsTrigger value="chats">Chats</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="mcqs">MCQs</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
        </TabsList>
        <TabsContent value="chats">{list("chats")}</TabsContent>
        <TabsContent value="notes">{list("notes")}</TabsContent>
        <TabsContent value="mcqs">{list("mcqs")}</TabsContent>
        <TabsContent value="flashcards">{list("flashcards")}</TabsContent>
      </Tabs>
    </div>
  );
}
