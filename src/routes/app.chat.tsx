import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  MessageSquare, Send, RefreshCw, Copy, Trash2, Sparkles, FileText, Search, User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

export const Route = createFileRoute("/app/chat")({
  component: Chat,
  head: () => ({ meta: [{ title: "AI Chat — IntelliLearn AI" }] }),
});

type Msg = { id: string; role: "user" | "ai"; text: string };

const docs = [
  { id: "1", name: "Machine Learning Textbook", pages: 342 },
  { id: "2", name: "DBMS Complete Notes", pages: 128 },
  { id: "3", name: "Operating Systems", pages: 210 },
  { id: "4", name: "Computer Networks", pages: 176 },
];

const suggestions = [
  "Summarize chapter 3 in 5 bullets",
  "Give me 5 exam-style questions",
  "Explain backpropagation simply",
  "Compare supervised vs unsupervised",
];

const initial: Msg[] = [
  { id: "1", role: "user", text: "What are the key differences between supervised and unsupervised learning?" },
  { id: "2", role: "ai", text: "Great question! Supervised learning uses **labeled** data (input → known output), while unsupervised learning finds patterns in **unlabeled** data.\n\n• Supervised: classification, regression (e.g., spam detection)\n• Unsupervised: clustering, dimensionality reduction (e.g., K-means, PCA)\n\nWant me to generate MCQs on this?" },
];

function Chat() {
  const [activeDoc, setActiveDoc] = useState(docs[0]);
  const [q, setQ] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", text: value };
    setMsgs((p) => [...p, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((p) => [...p, { id: crypto.randomUUID(), role: "ai", text: `Here's what I found in **${activeDoc.name}** regarding "${value}":\n\nThis concept appears in chapters 2 and 4. The core idea is that models generalize by learning patterns from examples rather than being explicitly programmed. Would you like a deeper breakdown or practice questions?` }]);
      setTyping(false);
    }, 900);
  };

  return (
    <div className="grid h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      {/* Left panel */}
      <Card className="glass hidden flex-col p-4 lg:flex">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search PDFs…" className="pl-9 bg-card/40" />
        </div>
        <div className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Your PDFs</div>
        <ScrollArea className="mt-2 flex-1">
          <div className="space-y-1.5">
            {docs.filter((d) => d.name.toLowerCase().includes(q.toLowerCase())).map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDoc(d)}
                className={`flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition ${activeDoc.id === d.id ? "gradient-bg text-white glow" : "hover:bg-accent"}`}
              >
                <FileText className="h-4 w-4 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{d.name}</div>
                  <div className={`text-[10px] ${activeDoc.id === d.id ? "text-white/70" : "text-muted-foreground"}`}>{d.pages} pages</div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Chat panel */}
      <Card className="glass flex min-h-0 flex-col p-0">
        <div className="flex items-center justify-between border-b border-border/60 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-bg"><MessageSquare className="h-4 w-4 text-white" /></div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">{activeDoc.name}</div>
              <div className="text-xs text-muted-foreground">Chatting with your PDF</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost"><RefreshCw className="mr-1 h-3.5 w-3.5" />Regenerate</Button>
            <Button size="sm" variant="ghost" onClick={() => { setMsgs([]); toast.success("Chat cleared"); }}><Trash2 className="mr-1 h-3.5 w-3.5" />Clear</Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-3xl space-y-5">
            {msgs.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${m.role === "user" ? "bg-accent" : "gradient-bg"}`}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4 text-white" />}
                </div>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${m.role === "user" ? "gradient-bg text-white rounded-br-md" : "border border-border bg-card/60 rounded-bl-md"}`}>
                  <div className="whitespace-pre-wrap leading-relaxed">{m.text}</div>
                  {m.role === "ai" && (
                    <div className="mt-2 flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs" onClick={() => { navigator.clipboard.writeText(m.text); toast.success("Copied"); }}>
                        <Copy className="h-3 w-3" />Copy
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs"><RefreshCw className="h-3 w-3" />Regenerate</Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-lg gradient-bg"><Sparkles className="h-4 w-4 text-white" /></div>
                <div className="rounded-2xl rounded-bl-md border border-border bg-card/60 px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="h-2 w-2 rounded-full bg-brand-accent" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border/60 p-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((s) => (
                <Badge key={s} variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => send(s)}>{s}</Badge>
              ))}
            </div>
            <div className="glass flex items-end gap-2 rounded-xl p-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask anything about your PDF…"
                rows={1}
                className="min-h-[40px] resize-none border-0 bg-transparent focus-visible:ring-0"
              />
              <Button size="icon" className="gradient-bg text-white glow" onClick={() => send()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
