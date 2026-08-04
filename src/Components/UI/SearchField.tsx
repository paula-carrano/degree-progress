import { MagnifyingGlassIcon } from "@phosphor-icons/react";

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export const SearchField = ({ value, onChange, placeholder, className = "" }: SearchFieldProps) => (
  <label className={`relative block ${className}`}>
    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400"
    />
  </label>
);
