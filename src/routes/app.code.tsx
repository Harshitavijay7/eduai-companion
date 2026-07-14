import { createFileRoute } from "@tanstack/react-router";
import { Code2, Copy, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { toast } from "sonner";

export const Route = createFileRoute("/app/code")({
  component: CodeExtractor,
  head: () => ({ meta: [{ title: "Code Extractor — IntelliLearn AI" }] }),
});

const snippets = [
  {
    lang: "Python",
    title: "Simple neural network in PyTorch",
    code: `import torch
import torch.nn as nn

class Net(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return self.fc2(x)

model = Net()`,
  },
  {
    lang: "SQL",
    title: "Inner join with aggregation",
    code: `SELECT u.name, COUNT(o.id) AS orders, SUM(o.total) AS revenue
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.created_at >= DATE '2025-01-01'
GROUP BY u.name
ORDER BY revenue DESC
LIMIT 10;`,
  },
  {
    lang: "JavaScript",
    title: "Debounce utility",
    code: `function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}`,
  },
];

const colors: Record<string, string> = {
  Python: "from-yellow-500 to-orange-500",
  SQL: "from-cyan-500 to-blue-500",
  JavaScript: "from-amber-400 to-yellow-500",
};

function CodeExtractor() {
  return (
    <div>
      <PageHeader title="Code Extractor" subtitle="Auto-detected snippets with syntax highlighting." icon={Code2} />

      <div className="grid gap-5">
        {snippets.map((s, i) => (
          <Card key={i} className="glass overflow-hidden p-0">
            <div className="flex items-center justify-between border-b border-border/60 p-4">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full bg-gradient-to-br ${colors[s.lang]}`} />
                <div>
                  <div className="text-sm font-semibold">{s.title}</div>
                  <div className="text-xs text-muted-foreground">Detected language</div>
                </div>
                <Badge className="gradient-bg text-white">{s.lang}</Badge>
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(s.code); toast.success("Copied"); }}><Copy className="mr-1 h-3.5 w-3.5" />Copy</Button>
                <Button size="sm" variant="outline"><Download className="mr-1 h-3.5 w-3.5" />Download</Button>
              </div>
            </div>
            <pre className="overflow-x-auto bg-black/40 p-5 text-sm leading-relaxed">
              <code className="font-mono text-brand-accent">{s.code}</code>
            </pre>
          </Card>
        ))}
      </div>
    </div>
  );
}
