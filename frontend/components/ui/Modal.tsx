"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";

export interface ModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Called when the modal should close */
  onClose: () => void;
  /** Modal header title */
  title: string;
  /** Modal body content */
  children: ReactNode;
}

/**
 * Accessible modal dialog with backdrop, escape-to-close,
 * click-outside-to-close, and focus management.
 */
export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    const timer = window.setTimeout(() => {
      const closeBtn = dialogRef.current?.querySelector<HTMLElement>("button");
      closeBtn?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-2xl border border-km-border km-glass p-6 shadow-xl dark:border-km-green/20 sm:p-8"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="text-lg font-bold km-text-primary sm:text-xl"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-km-border/60 text-km-text-muted transition-colors hover:border-km-green/40 hover:text-km-green dark:border-km-green/20"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="km-text-muted">{children}</div>
      </div>
    </div>
  );
}
