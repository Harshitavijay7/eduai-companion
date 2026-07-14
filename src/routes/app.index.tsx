import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileText, MessageSquare, ListChecks, Layers, Upload as UploadIcon,
  TrendingUp, Sparkles, ArrowRight, Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — IntelliLearn AI" }] }),
});

const stats = [
  { title: "Uploaded PDFs", value: 24, delta: "+3 this week", icon: FileText, tone: "brand" },
  { title: "Questions Asked", value: 412, delta: "+58 this week", icon: MessageSquare, tone: "accent" },
  { title: "Notes Generated", value: 37, delta: "+7 this week", icon: FileText, tone: "brand-2" },
  { title: "MCQs Generated", value: 1284, delta: "+240 this week", icon: ListChecks, tone: "brand" },
  { title: "Flashcards", value: 306, delta: "+42 this week", icon: Layers, tone: "accent" },
];

const chartData = [
  { d: "Mon", questions: 24, notes: 4 },
  { d: "Tue", questions: 41, notes: 7 },
  { d: "Wed", questions: 33, notes: 6 },
  { d: "Thu", questions: 58, notes: 9 },
  { d: "Fri", questions: 47, notes: 8 },
  { d: "Sat", questions: 72, notes: 12 },
  { d: "Sun", questions: 65, notes: 10 },
];

const activity = [
  { title: "Generated 20 MCQs from ML_Book.pdf", time: "2m ago", icon: ListChecks },
  { title: "Asked 4 questions about Chapter 3", time: "1h ago", icon: MessageSquare },
  { title: "Created revision notes for DBMS", time: "3h ago", icon: FileText },
  { title: "Uploaded OS_Notes.pdf", time: "Yesterday", icon: UploadIcon },
  { title: "Completed quiz — 92% score", time: "2 days ago", icon: TrendingUp },
];

const quickActions = [
  { title: "Upload PDF", to: "/app/upload", icon: UploadIcon },
  { title: "Start Chat", to: "/app/chat", icon: MessageSquare },
  { title: "Generate Notes", to: "/app/notes", icon: FileText },
  { title: "Generate Quiz", to: "/app/quiz", icon: ListChecks },
] as const;

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Welcome back, Alex 👋"
        subtitle="Here's what's happening in your study space today."
        icon={Sparkles}
        actions={
          <Button asChild className="gradient-bg text-white glow">
            <Link to="/app/upload">Upload PDF <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="glass p-5 transition hover:-translate-y-0.5 hover:glow">
              <div className="flex items-center justify-between">
                <div className="grid h-9 w-9 place-items-center rounded-lg gradient-bg"><s.icon className="h-4 w-4 text-white" /></div>
                <Badge variant="outline" className="border-brand-accent/30 text-brand-accent">{s.delta}</Badge>
              </div>
              <div className="mt-4 text-3xl font-bold">{s.value.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{s.title}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="glass p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Weekly Activity</h3>
              <p className="text-xs text-muted-foreground">Questions asked & notes generated</p>
            </div>
            <Badge variant="outline">Last 7 days</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="questions" stroke="var(--brand)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="notes" stroke="var(--brand-accent)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass p-6">
          <h3 className="mb-4 font-semibold">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.to} to={a.to} className="group glass rounded-xl p-4 transition hover:-translate-y-0.5 hover:glow">
                <div className="grid h-9 w-9 place-items-center rounded-lg gradient-bg"><a.icon className="h-4 w-4 text-white" /></div>
                <div className="mt-3 text-sm font-semibold">{a.title}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground group-hover:text-brand-accent">
                  Open <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="glass mt-6 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Recent Activity</h3>
          <Button variant="ghost" size="sm">View all</Button>
        </div>
        <ul className="divide-y divide-border/60">
          {activity.map((a, i) => (
            <li key={i} className="flex items-center gap-3 py-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent"><a.icon className="h-4 w-4" /></div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm">{a.title}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{a.time}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
