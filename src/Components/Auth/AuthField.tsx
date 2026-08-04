import type { ReactNode } from "react";

type AuthFieldProps = {
  label: string;
  icon: ReactNode;
  type: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  minLength?: number;
};

export const AuthField = ({ label, icon, value, onChange, ...inputProps }: AuthFieldProps) => (
  <label className="block">
    <span className="mb-1.5 block text-sm font-medium">{label}</span>
    <span className="relative block">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      <input
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-500"
        {...inputProps}
      />
    </span>
  </label>
);
