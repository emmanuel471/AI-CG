import { type HTMLAttributes, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  hoverable?: boolean;
  padded?: boolean;
}

export function Card({
  children,
  hoverable = false,
  padded = true,
  className,
  ...rest
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      {...rest}
      className={cn(
        "glass rounded-2xl shadow-card",
        hoverable && "cursor-pointer hover:shadow-glow hover:border-primary/40",
        padded && "p-6",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({
  children,
  className,
  ...rest
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return (
    <h3 {...rest} className={cn("text-lg font-semibold tracking-tight", className)}>
      {children}
    </h3>
  );
}
