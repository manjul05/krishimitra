"use client";

import type { InputHTMLAttributes } from "react";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  /** Label text displayed above the input */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** HTML input type */
  type?: string;
  /** Controlled input value */
  value?: string;
  /** Change handler */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Error message — triggers error styling when present */
  error?: string;
}

/**
 * Accessible form input with label, error state, and responsive styling.
 */
export default function Input({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  id,
  className = "",
  ...rest
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium km-text-primary"
        >
          {label}
        </label>
      )}

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm km-text-primary transition-colors placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-km-green/30 dark:bg-km-green-dark/40 dark:placeholder:text-gray-500 ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-200 dark:border-red-500/60"
            : "border-km-border focus:border-km-green dark:border-km-green/30"
        }`}
        {...rest}
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}
