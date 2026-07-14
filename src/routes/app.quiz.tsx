import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Clock, ChevronRight, RotateCcw, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/quiz")({
  component: Quiz,
  head: () => ({ meta: [{ title: "Quiz — IntelliLearn AI" }] }),
});

const questions = [
  { q: "Which of these is a supervised learning algorithm?", opts: ["K-Means", "Linear Regression", "PCA", "DBSCAN"], correct: 1 },
  { q: "What does 'epoch' mean in training?", opts: ["A single weight update", "One full pass through the training data", "A batch of samples", "A layer in the network"], correct: 1 },
  { q: "Which activation prevents vanishing gradients best?", opts: ["Sigmoid", "Tanh", "ReLU", "Softmax"], correct: 2 },
  { q: "Purpose of the softmax function?", opts: ["Regularization", "Converts logits to probabilities", "Reduces overfitting", "Speeds up gradient descent"], correct: 1 },
  { q: "Adam optimizer combines…", opts: ["SGD + Momentum + RMSProp", "SGD + BatchNorm", "Momentum only", "L2 regularization"], correct: 0 },
];

const leaderboard = [
  { name: "Priya S.", score: 98 },
  { name: "You", score: 92, me: true },
  { name: "Rahul V.", score: 88 },
  { name: "Ananya I.", score: 84 },
  { name: "Karan M.", score: 79 },
];

function Quiz() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [time, setTime] = useState(60);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setTime((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);

  useEffect(() => { if (time === 0) setDone(true); }, [time]);

  const pick = (i: number) => {
    const next = [...answers]; next[idx] = i; setAnswers(next);
    setTimeout(() => {
      if (idx + 1 < questions.length) { setIdx(idx + 1); setTime(60); }
      else setDone(true);
    }, 300);
  };

  const score = answers.reduce((s, a, i) => s + (a === questions[i].correct ? 1 : 0), 0);
  const pct = Math.round((score / questions.length) * 100);

  if (done) {
    return (
      <div>
        <PageHeader title="Quiz Results" icon={Award} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="glass p-10 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full gradient-bg glow">
              <Trophy className="h-12 w-12 text-white" />
            </motion.div>
            <div className="mt-6 text-6xl font-bold gradient-text">{pct}%</div>
            <p className="mt-2 text-muted-foreground">You scored {score} out of {questions.length}</p>
            <div className="mt-8 flex justify-center gap-2">
              <Button variant="outline" onClick={() => { setIdx(0); setAnswers([]); setDone(false); setTime(60); }}><RotateCcw className="mr-1 h-4 w-4" />Retake</Button>
              <Button className="gradient-bg text-white glow">Review Answers</Button>
            </div>
          </Card>
          <Card className="glass p-6">
            <h3 className="mb-4 flex items-center gap-2 font-semibold"><Trophy className="h-4 w-4 text-brand-accent" />Leaderboard</h3>
            <ul className="space-y-2">
              {leaderboard.map((p, i) => (
                <li key={p.name} className={`flex items-center justify-between rounded-lg p-2.5 ${p.me ? "gradient-bg text-white" : "bg-card/40"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${p.me ? "bg-white/20" : "bg-accent"}`}>{i + 1}</span>
                    <span className="text-sm font-medium">{p.name}</span>
                  </div>
                  <span className="text-sm font-semibold">{p.score}%</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const progress = ((idx + 1) / questions.length) * 100;

  return (
    <div>
      <PageHeader title="Quiz Mode" subtitle="No pressure — you've got this." icon={Trophy} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="outline">Question {idx + 1} / {questions.length}</Badge>
          <Badge className={time < 15 ? "bg-destructive text-white" : "gradient-bg text-white"}><Clock className="mr-1 h-3 w-3" />{time}s</Badge>
        </div>
        <Progress value={progress} className="mb-8 h-1.5" />

        <motion.div key={idx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="glass p-8">
            <h2 className="text-xl font-semibold sm:text-2xl">{q.q}</h2>
            <div className="mt-6 grid gap-3">
              {q.opts.map((o, i) => (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-card/30 p-4 text-left transition hover:border-brand hover:bg-brand/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-border text-sm font-semibold group-hover:gradient-bg group-hover:text-white group-hover:border-transparent">{String.fromCharCode(65 + i)}</span>
                    <span>{o}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
