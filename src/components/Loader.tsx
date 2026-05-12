import { cn } from "@/lib/utils";

export interface LoaderProps {
  size?: number;
  label?: string;
  className?: string;
  fullscreen?: boolean;
}

export function Loader({ size = 32, label, className, fullscreen = false }: LoaderProps) {
  const spinner = (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div
        className="rounded-full border-2 border-primary/30 border-t-primary animate-spin"
        style={{ width: size, height: size }}
      />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="flex min-h-[60vh] w-full items-center justify-center">{spinner}</div>
    );
  }
  return spinner;
}
