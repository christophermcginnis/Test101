"use client";

import { forwardRef, useState } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    return (
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
        <span>{label}</span>
        <div className="relative flex items-center">
          <input
            ref={ref}
            type={visible ? "text" : "password"}
            className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base font-normal text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((value) => !value)}
            className="absolute right-2 text-xs font-semibold text-indigo-600"
          >
            {visible ? "Hide" : "Show"}
          </button>
        </div>
        {error ? <span className="text-xs text-rose-600">{error}</span> : null}
      </label>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
