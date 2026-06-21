"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/** Visual style variants for the Button component. */
export type ButtonVariant = "primary" | "secondary" | "outline";

/** Size presets for the Button component. */
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Button label or content */
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-km-green text-white shadow-sm shadow-km-green/20 hover:bg-km-green-dark focus-visible:ring-km-green/50 dark:shadow-km-green/10",
  secondary:
    "bg-km-green-light text-km-green hover:bg-km-green/10 focus-visible:ring-km-green/30 dark:bg-km-green/20 dark:text-km-green-light dark:hover:bg-km-green/30",
  outline:
    "border border-km-border bg-transparent text-km-green hover:border-km-green/40 hover:bg-km-green-light/50 focus-visible:ring-km-green/30 dark:border-km-green/30 dark:text-km-green-light dark:hover:bg-km-green/10",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-2xl",
};

/**
 * Reusable button component with variant and size support.
 * Uses KrishiMitra brand colors and supports dark mode.
 */
export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  children,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-km-green-dark ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
