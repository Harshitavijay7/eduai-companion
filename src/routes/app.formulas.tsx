import { createFileRoute } from "@tanstack/react-router";
import { Sigma, Copy, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/formulas")({
  component: Formulas,
  head: () => ({ meta: [{ title: "Formula Extractor — IntelliLearn AI" }] }),
});

const formulas = [
  { id: 1, name: "Sigmoid activation", formula: "σ(x) = 1 / (1 + e^(-x))", topic: "Activations", page: 42 },
  { id: 2, name: "Cross-entropy loss", formula: "L = -Σ y_i · log(ŷ_i)", topic: "Loss functions", page: 78 },
  { id: 3, name: "Softmax", formula: "softmax(x_i) = e^(x_i) / Σ e^(x_j)", topic: "Activations", page: 45 },
  { id: 4, name: "Gradient descent update", formula: "w ← w − η · ∂L/∂w", topic: "Optimization", page: 112 },
  { id: 5, name: "Adam moment estimates", formula: "m_t = β₁·m_{t-1} + (1-β₁)·g_t", topic: "Optimization", page: 128 },
  { id: 6, name: "L2 regularization", formula: "L = L_data + λ · Σ w²", topic: "Regularization", page: 156 },
];

function Formulas() {
  return (
    <div>
      <PageHeader
        title="Formula Extractor"
        subtitle="All mathematical expressions from your PDFs, in one place."
        icon={Sigma}
        actions={
          <div className="flex gap-2">
            <Button variant="outline"><Download className="mr-1 h-4 w-4" />Export</Button>
          </div>
        }
      />

      <Card className="glass overflow-hidden p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border/60 hover:bg-transparent">
              <TableHead className="w-16">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Formula</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead className="text-right">Page</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formulas.map((f) => (
              <TableRow key={f.id} className="border-border/40">
                <TableCell className="text-muted-foreground">{f.id}</TableCell>
                <TableCell className="font-medium">{f.name}</TableCell>
                <TableCell><code className="rounded bg-card/60 px-2 py-1 font-mono text-xs">{f.formula}</code></TableCell>
                <TableCell><Badge variant="outline">{f.topic}</Badge></TableCell>
                <TableCell className="text-right text-muted-foreground">p.{f.page}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => { navigator.clipboard.writeText(f.formula); toast.success("Copied"); }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
