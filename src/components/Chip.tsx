import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "primary" | "success" | "warning" | "accent";

export interface ChipProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  onClick?: () => void;
}

const tones: Record<Tone, string> = {
  default: "bg-white/5 text-foreground/80 border-white/10",
  primary: "bg-primary/15 text-primary-glow border-primary/30",
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  accent: "bg-accent/15 text-accent border-accent/30",
};

export function Chip({ children, tone = "default", className, onClick }: ChipProps) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
        "backdrop-blur-md transition-colors",
        onClick && "cursor-pointer hover:brightness-125",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
