import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, ArrowRight, Play, MessageSquare, FileText, ListChecks, Layers,
  BarChart3, ScanText, Github, Twitter, Linkedin, Check, Star, Zap, Brain,
  Rocket, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Logo } from "@/components/logo";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "IntelliLearn AI — Study Smarter, Not Harder" },
      { name: "description", content: "Upload PDFs, chat with your notes, generate MCQs, flashcards, summaries and ace your exams with AI." },
    ],
  }),
});

const features = [
  { icon: MessageSquare, title: "Chat with PDFs", desc: "Ask your documents anything — get grounded answers with citations." },
  { icon: FileText, title: "AI Notes", desc: "Short, detailed, revision, and exam-ready notes generated in seconds." },
  { icon: ListChecks, title: "MCQ Generator", desc: "10 to 100 questions across easy, medium, or hard difficulty." },
  { icon: Layers, title: "Flashcards", desc: "Spaced repetition flashcards with beautiful flip animations." },
  { icon: ScanText, title: "OCR & Extractors", desc: "Pull text, code, and formulas out of images and scans." },
  { icon: BarChart3, title: "Analytics", desc: "Track study time, weak topics, and improvement over time." },
];

const stats = [
  { v: "10K+", l: "Documents" },
  { v: "50K+", l: "Questions" },
  { v: "95%", l: "Accuracy" },
  { v: "4.9★", l: "Rating" },
];

const testimonials = [
  { name: "Priya Sharma", role: "IIT Delhi, CSE", quote: "Cut my revision time in half. The MCQ generator is a game-changer before exams." },
  { name: "Rahul Verma", role: "GATE Aspirant", quote: "Chatting with my textbooks feels like having a personal tutor available 24/7." },
  { name: "Ananya Iyer", role: "NEET Student", quote: "The flashcards and analytics helped me identify weak topics fast. Love the UI." },
];

const roadmap = [
  { q: "Q1", title: "Multi-doc chat", desc: "Ask questions across your whole library at once.", done: true },
  { q: "Q2", title: "Voice viva mode", desc: "Practice viva with an AI examiner via voice.", done: true },
  { q: "Q3", title: "Collaborative notebooks", desc: "Share notes and flashcard decks with classmates.", done: false },
  { q: "Q4", title: "Mobile app", desc: "Native iOS and Android with offline flashcards.", done: false },
];

const faqs = [
  { q: "Is IntelliLearn AI free to use?", a: "Yes, the Free plan lets you upload PDFs, chat, and generate MCQs, notes, and flashcards. Pro is coming soon with higher limits." },
  { q: "What file formats are supported?", a: "PDFs are supported today. DOCX, PPTX, and image OCR are available via our extractors." },
  { q: "Is my data private?", a: "Your documents are private to your account. We never train on your data." },
  { q: "Can I use it for competitive exams?", a: "Absolutely — GATE, NEET, UPSC, and university syllabi all work well." },
];

function Nav() {
  const items = ["Home", "Features", "Roadmap", "About", "FAQ", "Contact"];
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {items.map((i) => (
            <a key={i} href={`#${i.toLowerCase()}`} className="text-sm text-muted-foreground transition hover:text-foreground">
              {i}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
          <Button asChild size="sm" className="gradient-bg text-white glow"><Link to="/register">Get Started</Link></Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden hero-bg">
      {/* Animated background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid mask-fade animate-grid-drift opacity-60" />
      <div aria-hidden className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand/30 blur-3xl animate-blob" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-40 h-[28rem] w-[28rem] rounded-full bg-brand-accent/20 blur-3xl animate-float-x" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-brand-2/25 blur-3xl animate-float-slow" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Badge className="mb-6 gap-1 border-brand/30 bg-brand/10 text-brand-accent animate-bob" variant="outline">
            <Sparkles className="h-3 w-3" /> Powered by advanced LLMs
          </Badge>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Study Smarter,<br />
            <span className="gradient-text-animated">Not Harder.</span>

          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            Upload PDFs, chat with your notes, generate MCQs, flashcards, summaries — and ace your exams with AI.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="gradient-bg text-white glow">
              <Link to="/register">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/15 bg-white/5 backdrop-blur">
              <Play className="mr-1 h-4 w-4" /> Live Demo
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex -space-x-2">
              {["A","P","R","S"].map((c, i) => (
                <div key={i} className="grid h-7 w-7 place-items-center rounded-full gradient-bg text-[10px] font-bold text-white ring-2 ring-background">{c}</div>
              ))}
            </div>
            <span>Trusted by 10,000+ students worldwide</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative">
          <div aria-hidden className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-brand via-brand-2 to-brand-accent opacity-40 blur-2xl animate-glow-pulse" />
          <div className="relative glass rounded-3xl p-6 shadow-2xl animate-tilt">

            <div className="mb-4 flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
              <div className="ml-3 text-xs text-muted-foreground">intellilearn.ai/chat</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md gradient-bg px-4 py-2.5 text-sm text-white">
                  Summarize Chapter 3 in 5 bullet points.
                </div>
              </div>
              <div className="flex gap-2">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-lg gradient-bg">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-border bg-card/60 px-4 py-2.5 text-sm">
                  <p className="mb-2">Here's a distilled summary of Chapter 3:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Neural nets learn hierarchical features</li>
                    <li>• Backprop uses chain rule for gradients</li>
                    <li>• Dropout mitigates overfitting</li>
                    <li>• Adam adapts learning rates per parameter</li>
                    <li>• Batch norm stabilizes training</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-9">
                {["Generate MCQs", "Make flashcards", "Explain deeper"].map((s) => (
                  <button key={s} className="rounded-full border border-border bg-card/60 px-3 py-1 text-xs text-muted-foreground transition hover:text-foreground">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-4 -top-4 hidden rounded-2xl glass p-3 md:block"
          >
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-brand-accent" />
              <div>
                <div className="text-xs text-muted-foreground">Analyzing</div>
                <div className="text-sm font-semibold">ML_Book.pdf</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <section className="border-y border-border/40 bg-card/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-3xl font-bold gradient-text-animated sm:text-4xl">{s.v}</div>
            <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["GATE", "NEET", "UPSC", "JEE", "CAT", "GRE", "IIT Delhi", "IIT Bombay", "BITS Pilani", "NIT Trichy", "IIIT Hyderabad"];
  const row = [...items, ...items];
  return (
    <section aria-hidden className="relative overflow-hidden border-b border-border/40 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((n, i) => (
          <span key={i} className="text-sm font-semibold uppercase tracking-widest text-muted-foreground/70">
            ★ {n}
          </span>
        ))}
      </div>
    </section>
  );
}


function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand-accent">Features</Badge>
        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Everything you need to <span className="gradient-text">learn faster</span></h2>
        <p className="mt-4 text-muted-foreground">A complete AI study suite — from ingestion to mastery.</p>
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8 }}
            className="group relative"
          >
            <div aria-hidden className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand/40 via-brand-accent/30 to-brand-2/40 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
            <Card className="glass relative h-full overflow-hidden p-6 transition-all duration-500 group-hover:border-brand/40">
              <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl gradient-bg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                <f.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

    </section>
  );
}

function Roadmap() {
  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand-accent">Roadmap</Badge>
        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">What's <span className="gradient-text">next</span></h2>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {roadmap.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
            <Card className="glass h-full p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">{r.q} 2026</span>
                {r.done ? <Check className="h-4 w-4 text-green-400" /> : <Zap className="h-4 w-4 text-muted-foreground" />}
              </div>
              <h3 className="mt-3 text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand-accent">About</Badge>
          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Built by students, for <span className="gradient-text">students</span></h2>
          <p className="mt-4 text-muted-foreground">
            IntelliLearn AI started as a final-year project to solve one problem: cramming shouldn't be a study strategy.
            We're on a mission to make deep understanding accessible with tools that respect your time.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { icon: Rocket, t: "Fast", d: "Answers in seconds" },
              { icon: Shield, t: "Private", d: "Your data stays yours" },
              { icon: Brain, t: "Grounded", d: "Cites your PDFs" },
              { icon: Star, t: "Loved", d: "10k+ students" },
            ].map((c) => (
              <div key={c.t} className="glass rounded-xl p-4">
                <c.icon className="h-5 w-5 text-brand-accent" />
                <div className="mt-2 font-semibold">{c.t}</div>
                <div className="text-xs text-muted-foreground">{c.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl gradient-bg opacity-30 blur-3xl" />
          <Card className="glass relative space-y-4 p-8">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-xl border border-border/50 bg-card/40 p-4">
                <div className="mb-2 flex text-brand-accent">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-sm">"{t.quote}"</p>
                <div className="mt-3 text-xs text-muted-foreground"><span className="font-semibold text-foreground">{t.name}</span> · {t.role}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand-accent">Pricing</Badge>
        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Simple, <span className="gradient-text">honest</span> pricing</h2>
      </div>
      <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
        <Card className="glass p-8">
          <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Free</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-5xl font-bold">$0</span>
            <span className="text-muted-foreground">/mo</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Everything you need to get started.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {["10 PDF uploads", "Unlimited chat", "AI notes & MCQs", "Flashcards", "Basic analytics"].map((f) => (
              <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-accent" />{f}</li>
            ))}
          </ul>
          <Button asChild className="mt-8 w-full" variant="outline"><Link to="/register">Get started free</Link></Button>
        </Card>
        <Card className="glass relative overflow-hidden border-brand/40 p-8">
          <div className="absolute right-4 top-4">
            <Badge className="gradient-bg text-white">Coming soon</Badge>
          </div>
          <div className="text-sm font-semibold uppercase tracking-widest text-brand-accent">Pro</div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-5xl font-bold gradient-text">$12</span>
            <span className="text-muted-foreground">/mo</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">For power learners who want it all.</p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Unlimited uploads", "Multi-doc chat", "Voice viva mode", "Priority models", "Advanced analytics", "Priority support"].map((f) => (
              <li key={f} className="flex items-center gap-2"><Check className="h-4 w-4 text-brand-accent" />{f}</li>
            ))}
          </ul>
          <Button disabled className="mt-8 w-full gradient-bg text-white opacity-70">Notify me</Button>
        </Card>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-4 py-24 sm:px-6">
      <div className="text-center">
        <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand-accent">FAQ</Badge>
        <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Frequently asked <span className="gradient-text">questions</span></h2>
      </div>
      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`q-${i}`} className="glass mb-3 rounded-xl border-none px-5">
            <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-border/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            The AI study companion that helps you understand, not memorize.
          </p>
          <div className="mt-6 flex gap-3">
            {[Github, Twitter, Linkedin].map((I, i) => (
              <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card/50 transition hover:text-brand-accent">
                <I className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {["Features", "Pricing", "Roadmap", "Changelog"].map((x) => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {["About", "Contact", "Privacy", "Terms"].map((x) => <li key={x}><a href="#" className="hover:text-foreground">{x}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="border-t border-border/40 py-5 text-center text-xs text-muted-foreground">
        © 2026 IntelliLearn AI · Built with ♥ for students.
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <Roadmap />
      <About />
      <Pricing />
      <FAQ />
      <Footer />
    </div>
  );
}
