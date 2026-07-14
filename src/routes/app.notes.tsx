import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Copy, Download, Share2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/notes")({
  component: Notes,
  head: () => ({ meta: [{ title: "AI Notes — IntelliLearn AI" }] }),
});

const styles = [
  { v: "short", l: "Short Notes", d: "Concise bullet points" },
  { v: "detailed", l: "Detailed Notes", d: "In-depth explanations" },
  { v: "revision", l: "Revision Notes", d: "Perfect for last-minute prep" },
  { v: "exam", l: "Exam Notes", d: "Structured for exam answers" },
];

const sampleNote = `# Backpropagation — Revision Notes

## Core Idea
Backpropagation efficiently computes the gradient of the loss function with respect to every weight in the network by applying the chain rule.

## Steps
1. **Forward pass** — compute predictions and loss.
2. **Backward pass** — propagate error signals backward through the network.
3. **Update** — adjust weights using an optimizer (SGD, Adam).

## Key Formulas
- Chain rule: ∂L/∂w = ∂L/∂y · ∂y/∂z · ∂z/∂w
- Weight update: w ← w − η · ∂L/∂w

## Common Pitfalls
- **Vanishing gradients** in deep networks with sigmoid activations
- Use **ReLU** and **batch normalization** to stabilize
- **Learning rate** too high → divergence; too low → slow training

## Exam Tip
Always mention the chain rule and give the weight-update formula.`;

function Notes() {
  const [style, setStyle] = useState("revision");
  const [doc, setDoc] = useState("ml");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(sampleNote);

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setOutput(sampleNote); setLoading(false); toast.success("Notes generated"); }, 900);
  };

  return (
    <div>
      <PageHeader title="AI Notes" subtitle="Turn any PDF into perfectly structured notes." icon={FileText} />

      <Card className="glass mb-6 p-6">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
          <div>
            <div className="mb-1.5 text-sm font-medium">Source Document</div>
            <Select value={doc} onValueChange={setDoc}>
              <SelectTrigger className="bg-card/40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ml">Machine Learning Textbook</SelectItem>
                <SelectItem value="dbms">DBMS Complete Notes</SelectItem>
                <SelectItem value="os">Operating Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <div className="mb-1.5 text-sm font-medium">Style</div>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="bg-card/40"><SelectValue /></SelectTrigger>
              <SelectContent>
                {styles.map((s) => (
                  <SelectItem key={s.v} value={s.v}>
                    <div className="flex flex-col"><span>{s.l}</span><span className="text-xs text-muted-foreground">{s.d}</span></div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="gradient-bg text-white glow" onClick={generate} disabled={loading}>
            <Sparkles className="mr-1 h-4 w-4" />{loading ? "Generating…" : "Generate"}
          </Button>
        </div>
      </Card>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="glass p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="gradient-bg text-white">{styles.find((s) => s.v === style)?.l}</Badge>
              <span className="text-xs text-muted-foreground">Generated · just now</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied"); }}><Copy className="mr-1 h-3.5 w-3.5" />Copy</Button>
              <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" />Download</Button>
              <Button size="sm" variant="outline"><Share2 className="mr-1 h-3.5 w-3.5" />Share</Button>
            </div>
          </div>
          <div className="prose prose-invert max-w-none rounded-xl border border-border/60 bg-card/30 p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{output}</pre>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
