import { ArrowRightIcon } from "@phosphor-icons/react";
import type { Subject } from "../../Types/academic";

export const CorrelativeCard = ({ subject, requirements }: { subject: Subject; requirements: Subject[] }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4"><span className="text-xs font-semibold text-violet-600">{subject.codigo}</span><h3 className="mt-1 font-bold text-slate-900">{subject.nombre}</h3></div>
    <div className="space-y-2">
      {requirements.map((requirement) => (
        <div key={requirement.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm">
          <span className="rounded-lg bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">{requirement.codigo}</span>
          <span className="flex-1 font-medium">{requirement.nombre}</span>
          <ArrowRightIcon className="text-slate-300" />
        </div>
      ))}
    </div>
  </article>
);
