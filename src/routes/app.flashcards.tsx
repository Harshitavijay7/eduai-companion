import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronLeft, ChevronRight, Shuffle, Download, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/app/flashcards")({
  component: Flashcards,
  head: () => ({ meta: [{ title: "Flashcards — IntelliLearn AI" }] }),
});

const initial = [
  { front: "What is backpropagation?", back: "An algorithm that uses the chain rule to compute gradients of the loss w.r.t. every weight, enabling efficient training." },
  { front: "Define overfitting.", back: "When a model learns training data too well — including noise — and fails to generalize to new data." },
  { front: "What is a CNN?", back: "A Convolutional Neural Network — designed for grid-like data (images) using convolutional and pooling layers." },
  { front: "Difference: precision vs recall?", back: "Precision = TP/(TP+FP). Recall = TP/(TP+FN). Precision cares about false positives; recall about false negatives." },
  { front: "What does gradient descent do?", back: "Iteratively moves weights in the direction opposite to the gradient of the loss to minimize it." },
];

function Flashcards() {
  const [cards, setCards] = useState(initial);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % cards.length); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + cards.length) % cards.length); };
  const shuffle = () => { setCards([...cards].sort(() => Math.random() - 0.5)); setIdx(0); setFlipped(false); };

  const card = cards[idx];
  const progress = ((idx + 1) / cards.length) * 100;

  return (
    <div>
      <PageHeader
        title="Flashcards"
        subtitle="Master concepts with spaced repetition."
        icon={Layers}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={shuffle}><Shuffle className="mr-1 h-4 w-4" />Shuffle</Button>
            <Button variant="outline"><Download className="mr-1 h-4 w-4" />Export</Button>
          </div>
        }
      />

      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between text-sm">
          <Badge variant="outline">Card {idx + 1} of {cards.length}</Badge>
          <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="mb-6 h-1.5" />

        <div className="relative h-[380px] [perspective:1200px]">
          <AnimatePresence mode="wait">
            <motion.button
              key={idx + (flipped ? "-b" : "-f")}
              onClick={() => setFlipped((f) => !f)}
              initial={{ rotateY: flipped ? -180 : 180, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 [transform-style:preserve-3d]"
            >
              <Card className={`glass flex h-full flex-col items-center justify-center gap-4 p-10 text-center transition ${flipped ? "border-brand-accent/40" : "border-brand/40"} glow`}>
                <Badge className={flipped ? "bg-brand-accent text-white" : "gradient-bg text-white"}>
                  {flipped ? "Answer" : "Question"}
                </Badge>
                <p className="text-2xl font-semibold leading-relaxed sm:text-3xl">
                  {flipped ? card.back : card.front}
                </p>
                <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCcw className="h-3 w-3" /> Click card to flip
                </div>
              </Card>
            </motion.button>
          </AnimatePresence>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button size="lg" variant="outline" onClick={prev}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button>
          <div className="flex gap-1">
            {cards.map((_, i) => (
              <button key={i} onClick={() => { setIdx(i); setFlipped(false); }} className={`h-1.5 w-6 rounded-full transition ${i === idx ? "gradient-bg" : "bg-border"}`} />
            ))}
          </div>
          <Button size="lg" className="gradient-bg text-white glow" onClick={next}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
