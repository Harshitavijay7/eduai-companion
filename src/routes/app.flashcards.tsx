import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, Loader2, AlertCircle, RefreshCw, RotateCcw, ChevronLeft, ChevronRight, Repeat } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/page-header";
import { PdfSelect, UploadPrompt, useReadyDocs } from "@/components/pdf-picker";
import { IntelliLearnAPI } from "@/lib/api";
import { friendlyAIError, pickArray } from "@/lib/ai-errors";
import { toast } from "sonner";

export const Route = createFileRoute("/app/flashcards")({
  component: Flashcards,
  head: () => ({
    meta: [
      { title: "Flashcards — IntelliLearn AI" },
      { name: "description", content: "Revise with 10 AI-generated flashcards from your PDF." },
      { property: "og:title", content: "Flashcards — IntelliLearn AI" },
      { property: "og:description", content: "Revise with 10 AI-generated flashcards from your PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type FC = { front: string; back: string };

function normalize(data: unknown): FC[] {
  return pickArray(data, ["flashcards", "cards", "data"])
    .map((raw) => {
      const c = raw as Record<string, unknown>;
      return { front: String(c.front ?? c.question ?? c.term ?? ""), back: String(c.back ?? c.answer ?? c.definition ?? "") };
    })
    .filter((c) => c.front && c.back);
}

function Flashcards() {
  const { docs, docId, setDocId, doc } = useReadyDocs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cards, setCards] = useState<FC[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const generate = async () => {
    if (!doc?.fileName || loading) return;
    setLoading(true);
    setError(null);
    try {
      const list = normalize(await IntelliLearnAPI.flashcards(doc.fileName));
      if (!list.length) throw new Error("empty");
      setCards(list);
      setIndex(0);
      setFlipped(false);
      toast.success(`${list.length} flashcards ready`);
    } catch (err) {
      setError(friendlyAIError(err));
    } finally {
      setLoading(false);
    }
  };

  const go = (i: number) => { setIndex(i); setFlipped(false); };
  const card = cards[index];

  return (
    <div>
      <PageHeader title="Flashcards" subtitle="Flip through 10 cards made from your PDF." icon={Layers} />

      <Card className="glass mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <PdfSelect docs={docs} value={docId} onChange={(v) => { setDocId(v); setError(null); setCards([]); }} disabled={loading} />
          <Button className="gradient-bg text-white glow" onClick={generate} disabled={!doc || loading}>
            {loading ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : cards.length ? <RefreshCw className="mr-1 h-4 w-4" /> : <Sparkles className="mr-1 h-4 w-4" />}
            {loading ? "Generating…" : cards.length ? "Regenerate Flashcards" : "Generate Flashcards"}
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

      {loading ? (
        <Card className="glass flex flex-col items-center gap-3 p-14 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
          <div className="text-lg font-semibold">Reading your PDF and making flashcards…</div>
          <p className="text-sm text-muted-foreground">This can take up to a minute.</p>
        </Card>
      ) : !cards.length ? (
        <Card className="glass flex flex-col items-center gap-3 p-14 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl gradient-bg glow"><Layers className="h-6 w-6 text-white" /></div>
          <div className="text-lg font-semibold">{docs.length ? "No flashcards yet" : "Upload a PDF to get started"}</div>
          <p className="max-w-sm text-sm text-muted-foreground">
            {docs.length ? "Pick a PDF above and click Generate Flashcards." : "Flashcards are made from PDFs you upload. Older uploads may need to be uploaded again."}
          </p>
          {!docs.length && <UploadPrompt />}
        </Card>
      ) : (
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Card {index + 1} of {cards.length}</span>
            <span className="text-muted-foreground">Tap the card to flip</span>
          </div>
          <Progress value={((index + 1) / cards.length) * 100} className="mb-5 h-1.5" />

          <button type="button" aria-label="Flip card" onClick={() => setFlipped((f) => !f)} className="block w-full [perspective:1200px]">
            <motion.div
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.5 }}
              className="relative h-72 w-full [transform-style:preserve-3d] sm:h-80"
            >
              <div className="glass absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border p-8 text-center [backface-visibility:hidden]">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-accent">Question</div>
                <div className="text-lg font-semibold leading-snug sm:text-xl">{card.front}</div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center overflow-auto rounded-2xl gradient-bg p-8 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/80">Answer</div>
                <div className="text-base leading-relaxed sm:text-lg">{card.back}</div>
              </div>
            </motion.div>
          </button>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
            <Button variant="outline" onClick={() => go(index - 1)} disabled={index === 0}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFlipped((f) => !f)}><Repeat className="mr-1 h-4 w-4" />Flip</Button>
              <Button variant="ghost" onClick={() => go(0)}><RotateCcw className="mr-1 h-4 w-4" />Restart</Button>
            </div>
            <Button className="gradient-bg text-white" onClick={() => go(index + 1)} disabled={index + 1 >= cards.length}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}
