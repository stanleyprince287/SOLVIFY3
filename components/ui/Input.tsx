import { forwardRef, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className = "", id, ...props },
  ref
) {
  const inputId = id ?? props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none
                    focus:border-primary focus:ring-1 focus:ring-primary bg-white ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});
