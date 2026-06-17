import { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-md border border-border-soft bg-white px-3.5 text-sm " +
  "text-foreground placeholder:text-text-secondary " +
  "focus:outline-none focus:ring-2 focus:ring-brand-amber focus:border-brand-amber " +
  "disabled:bg-surface-soft disabled:text-text-secondary disabled:cursor-not-allowed";

export const TextField = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(fieldBase, "h-11", className)} {...props} />
  ),
);
TextField.displayName = "TextField";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, "min-h-24 py-3 resize-none", className)} {...props} />
  ),
);
TextArea.displayName = "TextArea";

export const SelectField = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(fieldBase, "h-11 pr-10 appearance-none bg-white", className)} {...props}>
      {children}
    </select>
  ),
);
SelectField.displayName = "SelectField";

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
  hint?: string;
}

export const Field = ({ label, htmlFor, error, hint, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
      {label}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-text-secondary">{hint}</p>}
    {error && <p className="text-xs text-accent-red">{error}</p>}
  </div>
);
