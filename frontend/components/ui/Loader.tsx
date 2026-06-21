export type LoaderSize = "sm" | "md" | "lg";

export interface LoaderProps {
  /** Spinner diameter preset */
  size?: LoaderSize;
  /** When true, covers the entire viewport */
  fullscreen?: boolean;
  /** Optional accessible label */
  label?: string;
}

const sizeStyles: Record<LoaderSize, string> = {
  sm: "h-5 w-5 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

/**
 * Reusable spinner loader with optional full-screen overlay.
 * Uses Tailwind's animate-spin for smooth rotation.
 */
export default function Loader({
  size = "md",
  fullscreen = false,
  label = "Loading",
}: LoaderProps) {
  const spinner = (
    <div
      role="status"
      aria-label={label}
      className={`animate-spin rounded-full border-km-green/20 border-t-km-green ${sizeStyles[size]}`}
    />
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-km-green-dark/70">
        {spinner}
      </div>
    );
  }

  return spinner;
}
