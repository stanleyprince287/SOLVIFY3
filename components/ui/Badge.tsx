import { type HTMLAttributes } from "react";

type Variant = "default" | "success" | "warning" | "danger" | "info";

const styles: Record<Variant, string> = {
  default: "bg-gray-100 text-ink",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger:  "bg-danger/10 text-danger",
  info:    "bg-primary/10 text-primary"
};

type Props = HTMLAttributes<HTMLSpanElement> & { variant?: Variant };

export function Badge({ variant = "default", className = "", ...props }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
      {...props}
    />
  );
}