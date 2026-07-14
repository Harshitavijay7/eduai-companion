import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ListChecks, Download, Sparkles, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/mcqs")({
  component: MCQs,
  head: () => ({ meta: [{ title: "MCQ Generator — IntelliLearn AI" }] }),
});

const sample = Array.from({ length: 5 }).map((_, i) => ({
  q: [
    "Which algorithm is used for hyperparameter optimization?",
    "What does the chain rule apply to in backpropagation?",
    "Which optimizer adapts learning rates per parameter?",
    "What is the purpose of dropout in neural networks?",
    "Which layer type is best for sequential data?",
  ][i],
  options: [
    ["Grid Search", "K-Means", "PCA", "Naive Bayes"],
    ["Gradients", "Predictions", "Losses only", "Activations only"],
    ["SGD", "Adam", "Momentum", "RMSProp only"],
    ["Speed up training", "Prevent overfitting", "Increase accuracy always", "Reduce memory"],
    ["CNN", "MLP", "RNN / LSTM", "Autoencoder"],
  ][i],
  correct: [0, 0, 1, 1, 2][i],
  explain: "Grounded in Chapter 3 of your PDF — see page reference in the source.",
}));

function MCQs() {
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [showAnswers, setShowAnswers] = useState(true);
  const [selected, setSelected] = useState<Record<number, number>>({});

  return (
    <div>
      <PageHeader title="MCQ Generator" subtitle="Instant multiple-choice questions from your notes." icon={ListChecks} />

      <Card className="glass mb-6 p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <div className="mb-2 text-sm font-medium">Number of questions</div>
            <div className="flex flex-wrap gap-2">
              {[10, 20, 50, 100].map((n) => (
                <button key={n} onClick={() => setCount(n)} className={`rounded-lg border px-4 py-2 text-sm transition ${count === n ? "gradient-bg text-white border-transparent glow" : "border-border hover:bg-accent"}`}>{n}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">Difficulty</div>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 rounded-lg border px-4 py-2 text-sm capitalize transition ${difficulty === d ? "gradient-bg text-white border-transparent glow" : "border-border hover:bg-accent"}`}>{d}</button>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-center gap-2">
              <Switch id="ans" checked={showAnswers} onCheckedChange={setShowAnswers} />
              <Label htmlFor="ans" className="text-sm">Show answers</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Download className="mr-1 h-4 w-4" />PDF</Button>
              <Button className="gradient-bg text-white glow"><Sparkles className="mr-1 h-4 w-4" />Generate</Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {sample.map((q, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass p-6">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <Badge className="gradient-bg text-white">Q{i + 1}</Badge>
                  <h3 className="font-medium">{q.q}</h3>
                </div>
                <Badge variant="outline" className="capitalize">{difficulty}</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((opt, oi) => {
                  const isSel = selected[i] === oi;
                  const isCorrect = showAnswers && oi === q.correct;
                  const isWrong = showAnswers && isSel && oi !== q.correct;
                  return (
                    <button
                      key={oi}
                      onClick={() => setSelected((p) => ({ ...p, [i]: oi }))}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition ${
                        isCorrect ? "border-green-500/50 bg-green-500/10" :
                        isWrong ? "border-red-500/50 bg-red-500/10" :
                        isSel ? "border-brand bg-brand/10" :
                        "border-border hover:bg-accent"
                      }`}
                    >
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-xs font-semibold">{String.fromCharCode(65 + oi)}</span>
                      <span className="flex-1">{opt}</span>
                      {isCorrect && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      {isWrong && <XCircle className="h-4 w-4 text-red-400" />}
                    </button>
                  );
                })}
              </div>
              {showAnswers && (
                <div className="mt-3 rounded-lg border border-border/60 bg-card/30 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Explanation:</strong> {q.explain}
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
