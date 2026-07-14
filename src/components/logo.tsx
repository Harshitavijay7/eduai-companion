import { Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative grid h-9 w-9 place-items-center rounded-xl gradient-bg glow">
        <Sparkles className="h-5 w-5 text-white" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/20" />
      </div>
      {!compact && (
        <span className="text-lg font-bold tracking-tight">
          Intelli<span className="gradient-text">Learn</span>
        </span>
      )}
    </Link>
  );
}
