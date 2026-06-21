"use client";

import toast, { Toaster, type ToastOptions } from "react-hot-toast";

const baseOptions: ToastOptions = {
  duration: 4000,
  style: {
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    fontWeight: 500,
    maxWidth: "420px",
  },
};

/** Global toast container — mount once in the root layout. */
export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        ...baseOptions,
        className: "km-toast",
        success: {
          style: {
            ...baseOptions.style,
            background: "#e8f5ec",
            color: "#1a5c2e",
            border: "1px solid #c5e0ce",
          },
          iconTheme: { primary: "#1a5c2e", secondary: "#e8f5ec" },
        },
        error: {
          style: {
            ...baseOptions.style,
            background: "#fef2f2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          },
          iconTheme: { primary: "#dc2626", secondary: "#fef2f2" },
        },
      }}
    />
  );
}

/** Show a success toast notification. */
export function showSuccessToast(message: string) {
  toast.success(message, baseOptions);
}

/** Show an error toast notification. */
export function showErrorToast(message: string) {
  toast.error(message, baseOptions);
}

/** Show an informational toast notification. */
export function showInfoToast(message: string) {
  toast(message, {
    ...baseOptions,
    icon: "ℹ️",
    style: {
      ...baseOptions.style,
      background: "#eff6ff",
      color: "#1e40af",
      border: "1px solid #bfdbfe",
    },
  });
}
