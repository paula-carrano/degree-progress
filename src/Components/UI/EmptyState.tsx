import type { ReactNode } from "react";

export const EmptyState = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 ${className}`}>
    {children}
  </div>
);
