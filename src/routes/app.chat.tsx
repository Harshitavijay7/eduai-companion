import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Sparkles, Plus, Paperclip, User, Trash2, Search,
  MoreHorizontal, PenSquare, Menu, X, FileText, Bot, StopCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { IntelliLearnAPI } from "@/lib/api";

export const Route = createFileRoute("/app/chat")({
  component: Chat,
  head: () => ({
    meta: [
      { title: "AI Chat — IntelliLearn AI" },
      { name: "description", content: "Ask questions and study with IntelliLearn AI's learning assistant." },
      { property: "og:title", content: "AI Chat — IntelliLearn AI" },
      { property: "og:description", content: "Ask questions and study with IntelliLearn AI's learning assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Msg = {
  id: string;
  role: "user" | "ai";
  text: string;
  streaming?: boolean;
  attachment?: { name: string; size: number };
};

type Conversation = {
  id: string;
  title: string;
  messages: Msg[];
  updatedAt: number;
};

const suggestionCards = [
  { title: "Summarize a chapter", subtitle: "Turn dense material into 5 crisp bullets", prompt: "Summarize chapter 3 of my uploaded PDF into 5 concise bullet points." },
  { title: "Generate MCQs", subtitle: "Create exam-style practice questions", prompt: "Generate 5 exam-style multiple choice questions from my notes." },
  { title: "Explain like I'm 5", subtitle: "Simple analogies for tough concepts", prompt: "Explain backpropagation like I'm 5 years old, with an analogy." },
  { title: "Compare concepts", subtitle: "Side-by-side breakdowns", prompt: "Compare supervised vs unsupervised learning in a table." },
];

function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [attachment, setAttachment] = useState<{ name: string; size: number } | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamAbort = useRef<{ cancelled: boolean; controller?: AbortController } | null>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, streaming]);
  useEffect(() => { textareaRef.current?.focus(); }, [activeId]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  const newChat = useCallback(() => {
    setActiveId(null);
    setInput("");
    setAttachment(null);
    setSidebarOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, []);

  const deleteChat = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
    toast.success("Conversation deleted");
  };

  const renameChat = (id: string) => {
    const name = window.prompt("Rename conversation");
    if (!name) return;
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title: name } : c)));
  };

  const streamAiReply = (convId: string, full: string, token: { cancelled: boolean }) => {
    const aiId = crypto.randomUUID();
    setConversations((prev) => prev.map((c) => c.id === convId
      ? { ...c, messages: [...c.messages, { id: aiId, role: "ai", text: "", streaming: true }] }
      : c));

    const chunks = full.split(/(\s+)/);
    let i = 0;
    const tick = () => {
      if (token.cancelled) {
        setConversations((prev) => prev.map((c) => c.id === convId
          ? { ...c, messages: c.messages.map((m) => m.id === aiId ? { ...m, streaming: false } : m) }
          : c));
        setStreaming(false);
        streamAbort.current = null;
        return;
      }
      i += 1;
      const partial = chunks.slice(0, i).join("");
      setConversations((prev) => prev.map((c) => c.id === convId
        ? { ...c, messages: c.messages.map((m) => m.id === aiId ? { ...m, text: partial } : m) }
        : c));
      if (i < chunks.length) {
        setTimeout(tick, 22 + Math.random() * 40);
      } else {
        setConversations((prev) => prev.map((c) => c.id === convId
          ? { ...c, messages: c.messages.map((m) => m.id === aiId ? { ...m, streaming: false } : m) }
          : c));
        setStreaming(false);
        streamAbort.current = null;
      }
    };
    setTimeout(tick, 250);
  };

  const send = async (textArg?: string) => {
    const value = (textArg ?? input).trim();
    if (!value || streaming) return;

    const userMsg: Msg = {
      id: crypto.randomUUID(),
      role: "user",
      text: value,
      attachment: attachment ?? undefined,
    };

    let convId = activeId;
    if (!convId) {
      convId = crypto.randomUUID();
      const title = value.length > 40 ? value.slice(0, 40) + "…" : value;
      const conv: Conversation = { id: convId, title, messages: [userMsg], updatedAt: Date.now() };
      setConversations((prev) => [conv, ...prev]);
      setActiveId(convId);
    } else {
      const id = convId;
      setConversations((prev) => prev.map((c) => c.id === id
        ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }
        : c));
    }
    setInput("");
    setAttachment(null);
    setStreaming(true);

    const controller = new AbortController();
    const token = { cancelled: false, controller };
    streamAbort.current = token;

    try {
      const data = await IntelliLearnAPI.ask(value, controller.signal);
      if (token.cancelled) return;
      if (!data || typeof data.answer !== "string" || !data.answer.trim()) {
        throw new Error("The backend returned an empty answer.");
      }
      streamAiReply(convId, data.answer, token);
    } catch (error) {
      if (token.cancelled) {
        setStreaming(false);
        streamAbort.current = null;
        return;
      }

      const message = "I couldn't reach the learning service. Please check that the backend is running and try again.";
      setConversations((prev) => prev.map((conversation) => conversation.id === convId
        ? {
            ...conversation,
            messages: [...conversation.messages, {
              id: crypto.randomUUID(),
              role: "ai",
              text: message,
            }],
          }
        : conversation));
      setStreaming(false);
      streamAbort.current = null;
      toast.error(error instanceof Error ? error.message : "Unable to get an AI response.");
    }
  };

  const stopStreaming = () => {
    if (!streamAbort.current) return;
    streamAbort.current.cancelled = true;
    streamAbort.current.controller?.abort();
    setStreaming(false);
  };

  const onFile = (f: File | null) => {
    if (!f) return;
    setAttachment({ name: f.name, size: f.size });
    toast.success(`Attached ${f.name}`);
  };

  const filteredConvs = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 top-14 flex bg-background">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed z-40 h-[calc(100vh-3.5rem)] w-72 shrink-0 border-r border-border/60 bg-sidebar/95 backdrop-blur-xl transition-transform lg:static lg:z-auto lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-2 p-3">
            <Button onClick={newChat} className="flex-1 justify-start gap-2 gradient-bg text-white glow">
              <PenSquare className="h-4 w-4" />
              New chat
            </Button>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats"
                className="h-9 bg-card/40 pl-9 text-sm"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-2">
            {filteredConvs.length === 0 ? (
              <div className="px-3 py-8 text-center text-xs text-muted-foreground">
                {conversations.length === 0 ? "No conversations yet.\nStart a new chat!" : "No matches."}
              </div>
            ) : (
              <div className="space-y-0.5 py-2">
                <div className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Recent
                </div>
                {filteredConvs.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition",
                      activeId === c.id ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                    )}
                  >
                    <button
                      onClick={() => { setActiveId(c.id); setSidebarOpen(false); }}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-70" />
                      <span className="truncate">{c.title}</span>
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={cn(
                            "grid h-6 w-6 place-items-center rounded-md opacity-0 hover:bg-background/50 group-hover:opacity-100",
                            activeId === c.id && "opacity-100"
                          )}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => renameChat(c.id)}>
                          <PenSquare className="mr-2 h-3.5 w-3.5" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteChat(c.id)} className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="border-t border-border/60 p-3">
            <div className="flex items-center gap-2 rounded-lg p-2 hover:bg-accent/60">
              <div className="grid h-8 w-8 place-items-center rounded-full gradient-bg text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">Student</div>
                <div className="truncate text-[11px] text-muted-foreground">Free plan</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-3 backdrop-blur-xl sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-bg glow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">IntelliLearn AI</div>
              <div className="truncate text-[11px] text-muted-foreground">
                {active ? active.title : "New conversation"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={newChat} className="hidden sm:inline-flex">
              <Plus className="mr-1 h-4 w-4" /> New
            </Button>
            <div className="grid h-8 w-8 place-items-center rounded-full gradient-bg text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        {/* Messages / Welcome */}
        <div className="relative flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {messages.length === 0 ? (
              <Welcome onPick={(p) => send(p)} />
            ) : (
              <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
                <div className="space-y-6">
                  {messages.map((m) => (
                    <MessageBubble key={m.id} msg={m} />
                  ))}
                  {streaming && messages[messages.length - 1]?.role === "user" && <Typing />}
                  <div ref={endRef} />
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t border-border/60 bg-background/80 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4">
          <div className="mx-auto max-w-3xl">
            {attachment && (
              <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs">
                <FileText className="h-3.5 w-3.5 text-brand-accent" />
                <span className="truncate font-medium">{attachment.name}</span>
                <span className="text-muted-foreground">
                  {(attachment.size / 1024).toFixed(1)} KB
                </span>
                <button
                  onClick={() => setAttachment(null)}
                  className="ml-auto grid h-5 w-5 place-items-center rounded hover:bg-accent"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            <div className="glass relative flex items-end gap-1 rounded-2xl p-2 shadow-lg focus-within:ring-2 focus-within:ring-ring/40">
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0 rounded-xl"
                onClick={() => fileRef.current?.click()}
                title="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Message IntelliLearn AI…"
                rows={1}
                className="max-h-[200px] min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
              />
              {streaming ? (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-9 w-9 shrink-0 rounded-xl"
                  onClick={stopStreaming}
                  title="Stop"
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  disabled={!input.trim()}
                  className="h-9 w-9 shrink-0 rounded-xl gradient-bg text-white glow disabled:opacity-40"
                  onClick={() => send()}
                  title="Send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              IntelliLearn AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Welcome({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="grid h-16 w-16 place-items-center rounded-2xl gradient-bg glow"
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.05 } }}
        className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl"
      >
        How can I help you <span className="gradient-text-animated">learn</span> today?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base"
      >
        Ask a question, upload a PDF, or pick a starter below.
      </motion.p>

      <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
        {suggestionCards.map((s, i) => (
          <motion.button
            key={s.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.05 } }}
            whileHover={{ y: -2 }}
            onClick={() => onPick(s.prompt)}
            className="glass group rounded-xl p-4 text-left transition hover:border-primary/40"
          >
            <div className="text-sm font-semibold group-hover:gradient-text">{s.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.subtitle}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "")}
    >
      <div
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
          isUser ? "bg-accent" : "gradient-bg glow"
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "gradient-bg rounded-br-md text-white"
            : "rounded-bl-md border border-border bg-card/60"
        )}
      >
        {msg.attachment && (
          <div className={cn(
            "mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs",
            isUser ? "bg-white/15" : "bg-accent/60"
          )}>
            <FileText className="h-3.5 w-3.5" />
            <span className="truncate">{msg.attachment.name}</span>
          </div>
        )}
        {isUser ? (
          <div className="whitespace-pre-wrap">{msg.text}</div>
        ) : (
          <div className="md-content max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text || " "}
            </ReactMarkdown>
            {msg.streaming && (
              <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-foreground/70" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Typing() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
      <div className="grid h-8 w-8 place-items-center rounded-lg gradient-bg glow">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="rounded-2xl rounded-bl-md border border-border bg-card/60 px-4 py-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-brand-accent"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
