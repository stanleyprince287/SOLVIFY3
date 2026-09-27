import { forwardRef, type TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { label, error, className = "", id, ...props },
  ref
) {
  const textareaId = id ?? props.name;
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={4}
        className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none
                    focus:border-primary focus:ring-1 focus:ring-primary bg-white
                    resize-y ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
});