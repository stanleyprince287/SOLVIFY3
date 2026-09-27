import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant };

const styles: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-700",
  secondary: "bg-white border border-gray-200 text-ink hover:bg-gray-50",
  ghost: "text-primary hover:bg-primary/5",
  danger: "bg-danger text-white hover:opacity-90"
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { variant = "primary", className = "", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium
                  transition disabled:opacity-60 disabled:cursor-not-allowed
                  ${styles[variant]} ${className}`}
      {...props}
    />
  );
});