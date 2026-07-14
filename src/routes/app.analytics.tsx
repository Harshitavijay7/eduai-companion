import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PolarRadiusAxis,
} from "recharts";

export const Route = createFileRoute("/app/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — IntelliLearn AI" }] }),
});

const bars = [
  { d: "Mon", min: 45 }, { d: "Tue", min: 82 }, { d: "Wed", min: 60 },
  { d: "Thu", min: 110 }, { d: "Fri", min: 74 }, { d: "Sat", min: 138 }, { d: "Sun", min: 92 },
];

const radar = [
  { topic: "ML", score: 88 },
  { topic: "DBMS", score: 72 },
  { topic: "OS", score: 55 },
  { topic: "CN", score: 68 },
  { topic: "TOC", score: 40 },
  { topic: "Compilers", score: 62 },
];

const strong = ["Neural Networks", "SQL Joins", "Process Scheduling", "TCP/IP"];
const weak = ["Automata Theory", "Compiler Optimization", "Concurrency Locks"];

const heatmap = Array.from({ length: 7 * 12 }).map((_, i) => Math.floor(Math.random() * 5));

function Analytics() {
  return (
    <div>
      <PageHeader title="Analytics" subtitle="Understand your learning patterns." icon={BarChart3} />

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { l: "Study Time", v: "23h 42m", d: "+12% vs last week", icon: Clock },
          { l: "Questions Asked", v: "412", d: "+58 this week", icon: TrendingUp },
          { l: "Avg Quiz Score", v: "87%", d: "+4% vs last month", icon: TrendingUp },
        ].map((s) => (
          <Card key={s.l} className="glass p-6">
            <div className="flex items-center justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-lg gradient-bg"><s.icon className="h-4 w-4 text-white" /></div>
              <Badge variant="outline" className="border-brand-accent/30 text-brand-accent">{s.d}</Badge>
            </div>
            <div className="mt-4 text-3xl font-bold">{s.v}</div>
            <div className="text-sm text-muted-foreground">{s.l}</div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="glass p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold">Study Time (minutes)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars}>
                <defs>
                  <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" />
                    <stop offset="100%" stopColor="var(--brand-accent)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="min" fill="url(#bg)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="mb-4 font-semibold">Topic Mastery</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="topic" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
                <PolarRadiusAxis stroke="var(--border)" tick={false} />
                <Radar dataKey="score" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="glass p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold"><TrendingUp className="h-4 w-4 text-green-400" />Strong Topics</h3>
          <div className="flex flex-wrap gap-2">
            {strong.map((t) => <Badge key={t} className="bg-green-500/15 text-green-300 border-green-500/30" variant="outline">{t}</Badge>)}
          </div>
        </Card>
        <Card className="glass p-6">
          <h3 className="mb-3 flex items-center gap-2 font-semibold"><TrendingDown className="h-4 w-4 text-red-400" />Weak Topics</h3>
          <div className="flex flex-wrap gap-2">
            {weak.map((t) => <Badge key={t} className="bg-red-500/15 text-red-300 border-red-500/30" variant="outline">{t}</Badge>)}
          </div>
        </Card>
        <Card className="glass p-6">
          <h3 className="mb-3 font-semibold">Activity Heatmap</h3>
          <div className="grid grid-cols-12 gap-1">
            {heatmap.map((v, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ background: `color-mix(in oklab, var(--brand) ${v * 22}%, transparent)` }} />
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>12 weeks ago</span><span>Today</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
