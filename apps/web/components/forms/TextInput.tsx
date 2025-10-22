"use client";

import { forwardRef } from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <input
          ref={ref}
          className={`rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${className}`}
          {...props}
        />
        {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      </label>
    );
  }
);

TextInput.displayName = "TextInput";

export default TextInput;
