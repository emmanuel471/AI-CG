import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, leftIcon, className, id, ...rest },
  ref,
) {
  const inputId = id || rest.name || `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-foreground/90">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          {...rest}
          className={cn(
            "w-full h-11 rounded-xl bg-input border border-glass-border px-4 text-sm",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent",
            "transition-all duration-200",
            leftIcon && "pl-10",
            error && "border-destructive focus:ring-destructive/60",
            className,
          )}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
});
