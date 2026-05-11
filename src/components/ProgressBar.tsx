import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number; // 0-100
  required?: number; // 0-100 marker
  className?: string;
}

export function ProgressBar({ value, required, className }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("relative h-2 w-full rounded-full bg-white/5 overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full bg-gradient-primary"
      />
      {typeof required === "number" && (
        <div
          className="absolute top-0 h-full w-0.5 bg-warning/80"
          style={{ left: `${Math.max(0, Math.min(100, required))}%` }}
          title={`Required: ${required}%`}
        />
      )}
    </div>
  );
}
