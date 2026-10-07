import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ListChecks, Sparkles, Loader2, AlertCircle, RefreshCw, RotateCcw, ArrowRight, CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { PdfSelect, UploadPrompt, useReadyDocs } from "@/components/pdf-picker";
import { IntelliLearnAPI } from "@/lib/api";
import { friendlyAIError, pickArray } from "@/lib/ai-errors";
import { toast } from "sonner";

export const Route = createFileRoute("/app/mcqs")({
  component: MCQs,
  head: () => ({
    meta: [
      { title: "MCQs — IntelliLearn AI" },
      { name: "description", content: "Practice with 10 AI-generated multiple choice questions from your PDF." },
      { property: "og:title", content: "MCQs — IntelliLearn AI" },
      { property: "og:description", content: "Practice with 10 AI-generated multiple choice questions from your PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type MCQ = { question: string; options: string[]; correctAnswer: string; explanation?: string };

function normalize(data: unknown): MCQ[] {
  return pickArray(data, ["mcqs", "questions", "data"])
    .map((raw) => {
      const q = raw as Record<string, unknown>;
      const options = Array.isArray(q.options) ? q.options.map(String) : [];
      let correct = String(q.correctAnswer ?? q.answer ?? "");
      // Support letter/index style answers ("B" or 1)
      if (!options.includes(correct)) {
        const idx = /^[A-D]$/i.test(correct) ? correct.toUpperCase().charCodeAt(0) - 65 : Number.isInteger(Number(correct)) ? Number(correct) : -1;
        if (options[idx]) correct = options[idx];
        else correct = options.find((o) => o.trim().toLowerCase().startsWith(correct.trim().toLowerCase())) ?? correct;
      }
      return { question: String(q.question ?? ""), options, correctAnswer: correct, explanation: q.explanation ? String(q.explanation) : undefined };
    })
    .filter((q) => q.question && q.options.length >= 2);
}

function MCQs() {
  const { docs, docId, setDocId, doc } = useReadyDocs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<MCQ[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [finished, setFinished] = useState(false);

  const generate = async () => {
    if (!doc?.fileName || loading) return;
    setLoading(true);
    setError(null);
    try {
      const list = normalize(await IntelliLearnAPI.mcqs(doc.fileName));
      if (!list.length) throw new Error("empty");
      setItems(list);
      setAnswers(list.map(() => null));
      setIndex(0);
      setFinished(false);
      toast.success(`${list.length} MCQs ready`);
    } catch (err) {
      setError(friendlyAIError(err));
    } finally {
      setLoading(false);
    }
  };

  const restart = () => { setAnswers(items.map(() => null)); setIndex(0); setFinished(false); };
  const q = items[index];
  const picked = answers[index];
  const score = answers.filter((a, i) => a !== null && a === items[i]?.correctAnswer).length;

  return (
    <div>
      <PageHeader title="MCQs" subtitle="Test yourself with 10 questions from your PDF." icon={ListChecks} />

      <Card className="glass mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <PdfSelect docs={docs} value={docId} onChange={(v) => { setDocId(v); setError(null); setItems([]); }} disabled={loading} />
          <Button className="gradient-bg text-white glow" onClick={generate} disabled={!doc || loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : items.length ? <RefreshCw className="mr-1 h-4 w-4" /> : <Sparkles className="mr-1 h-4 w-4" />}
            {loading ? "Generating…" : items.length ? "Regenerate MCQs" : "Generate MCQs"}
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="mb-6 flex flex-wrap items-center gap-3 border-destructive/50 bg-destructive/10 p-4 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
          <div className="flex-1">{error}</div>
          <Button size="sm" variant="outline" onClick={generate} disabled={loading}>Try again</Button>
        </Card>
      )}

      <Card className="glass p-6">
        {loading ? (
          <Centered icon={<Loader2 className="h-8 w-8 animate-spin text-brand-accent" />} title="Reading your PDF and writing questions…" text="This can take up to a minute." />
        ) : !items.length ? (
          <Centered
            icon={<div className="grid h-14 w-14 place-items-center rounded-2xl gradient-bg glow"><ListChecks className="h-6 w-6 text-white" /></div>}
            title={docs.length ? "No questions yet" : "Upload a PDF to get started"}
            text={docs.length ? "Pick a PDF above and click Generate MCQs." : "Questions are made from PDFs you upload. Older uploads may need to be uploaded again."}
            action={docs.length ? undefined : <UploadPrompt />}
          />
        ) : finished ? (
          <Centered
            icon={<div className="grid h-16 w-16 place-items-center rounded-2xl gradient-bg glow"><Trophy className="h-7 w-7 text-white" /></div>}
            title={`${score} / ${items.length} Correct`}
            text={score / items.length >= 0.7 ? "Great work! You know this material well." : "Keep practicing — review the explanations and try again."}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" onClick={restart}><RotateCcw className="mr-1 h-4 w-4" />Retake</Button>
                <Button className="gradient-bg text-white" onClick={generate}><RefreshCw className="mr-1 h-4 w-4" />New questions</Button>
              </div>
            }
          />
        ) : (
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">Question {index + 1} of {items.length}</span>
              <span className="text-muted-foreground">Score: {score}</span>
            </div>
            <Progress value={((index + (picked ? 1 : 0)) / items.length) * 100} className="mb-6 h-1.5" />
            <AnimatePresence mode="wait">
              <motion.div key={index} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="mb-5 text-lg font-semibold leading-snug">{q.question}</h2>
                <div className="grid gap-3">
                  {q.options.map((opt, i) => {
                    const isCorrect = opt === q.correctAnswer;
                    const isPicked = opt === picked;
                    const state = !picked ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "dim";
                    return (
                      <button
                        key={i}
                        disabled={!!picked}
                        onClick={() => setAnswers((a) => a.map((x, j) => (j === index ? opt : x)))}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                          state === "idle" ? "border-border bg-card/40 hover:border-brand hover:bg-accent/40" :
                          state === "correct" ? "border-green-500/60 bg-green-500/10" :
                          state === "wrong" ? "border-destructive/60 bg-destructive/10" : "border-border/50 bg-card/20 opacity-60"
                        }`}
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-border text-xs font-semibold">{String.fromCharCode(65 + i)}</span>
                        <span className="flex-1">{opt}</span>
                        {state === "correct" && <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />}
                        {state === "wrong" && <XCircle className="h-5 w-5 shrink-0 text-destructive" />}
                      </button>
                    );
                  })}
                </div>
                {picked && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-xl border border-border/60 bg-card/40 p-4 text-sm">
                    <div className={`mb-1 font-semibold ${picked === q.correctAnswer ? "text-green-500" : "text-destructive"}`}>
                      {picked === q.correctAnswer ? "Correct!" : `Incorrect — the answer is: ${q.correctAnswer}`}
                    </div>
                    {q.explanation && <p className="text-muted-foreground">{q.explanation}</p>}
                  </motion.div>
                )}
                <div className="mt-6 flex justify-end">
                  <Button className="gradient-bg text-white" disabled={!picked} onClick={() => (index + 1 < items.length ? setIndex(index + 1) : setFinished(true))}>
                    {index + 1 < items.length ? <>Next Question<ArrowRight className="ml-1 h-4 w-4" /></> : "See Results"}
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </Card>
    </div>
  );
}

function Centered({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      {icon}
      <div className="text-lg font-semibold">{title}</div>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      {action}
    </div>
  );
}
