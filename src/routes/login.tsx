import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/login")({
  component: Login,
  head: () => ({ meta: [{ title: "Login — IntelliLearn AI" }] }),
});

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.9 1.5l2.6-2.5C16.9 3.3 14.7 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12S6.7 21.6 12 21.6c6.9 0 9.5-4.9 9.5-8 0-.5 0-.9-.1-1.4H12z"/>
    </svg>
  );
}

function AuthShell({ side, children }: { side: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden hero-bg lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Logo />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3 w-3 text-brand-accent" /> AI Study Companion
            </div>
            <h2 className="text-4xl font-bold leading-tight">
              Turn any PDF into a <span className="gradient-text">personal tutor.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join 10,000+ students who study smarter with IntelliLearn AI.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {["Chat", "Notes", "MCQs", "Flashcards", "OCR", "Analytics"].map((f) => (
                <div key={f} className="glass rounded-lg py-2 text-center text-xs">{f}</div>
              ))}
            </div>
          </motion.div>
          <div className="text-xs text-muted-foreground">© 2026 IntelliLearn AI</div>
        </div>
        {side}
      </div>
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Logo /></div>
          {children}
        </div>
      </div>
    </div>
  );
}

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  return (
    <AuthShell side={null}>
      <Card className="glass p-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to continue learning</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setTimeout(() => navigate({ to: "/app" }), 400);
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@student.edu" required />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-brand-accent hover:underline">Forgot?</a>
            </div>
            <Input id="password" type="password" placeholder="••••••••" required />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="remember" defaultChecked />
            <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Remember me for 30 days</Label>
          </div>
          <Button type="submit" disabled={loading} className="w-full gradient-bg text-white glow">
            {loading ? "Signing in…" : <>Log in <ArrowRight className="ml-1 h-4 w-4" /></>}
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full gap-2"><GoogleIcon /> Continue with Google</Button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here? <Link to="/register" className="text-brand-accent hover:underline">Create an account</Link>
        </p>
      </Card>
    </AuthShell>
  );
}

export { AuthShell, GoogleIcon };
