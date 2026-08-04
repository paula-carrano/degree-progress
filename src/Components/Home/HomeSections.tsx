import {
  ArrowRightIcon,
  BooksIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { Subject } from "../../Types/academic";
import "./HomeSections.css";

type ModuleProgress = {
  name: string;
  completed: number;
  total: number;
  percentage: number;
};

export const ProgressRing = ({ value }: { value: number }) => (
  <svg className="progress-ring" viewBox="0 0 36 36" aria-label={`${value}% completado`}>
    <circle className="progress-ring__track" cx="18" cy="18" r="15.9155" />
    <circle
      className="progress-ring__value"
      cx="18"
      cy="18"
      r="15.9155"
      pathLength="100"
      strokeDasharray={`${value} 100`}
    />
    <text className="progress-ring__label" x="18" y="20">{value}%</text>
  </svg>
);

export const ProgressOverview = ({ progress, approvedCredits, totalCredits }: { progress: number; approvedCredits: number; totalCredits: number }) => (
  <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-600 p-6 text-white shadow-lg shadow-violet-200 sm:p-8">
    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
      <div className="flex-1">
        <p className="text-sm text-violet-100">Progreso general</p>
        <p className="mt-2 text-5xl font-bold">{progress}%</p>
        <progress className="academic-progress mt-6" value={progress} max="100" />
        <p className="mt-2 text-sm text-violet-100">{approvedCredits} / {totalCredits} créditos</p>
      </div>
      <div className="grid grid-cols-[auto_1px_auto] items-center gap-6">
        <ProgressRing value={progress} />
        <div className="h-24 bg-white/20" />
        <div className="space-y-4 text-sm">
          <div><p className="text-violet-100">Aprobados</p><p className="text-2xl font-bold text-emerald-300">{approvedCredits}</p></div>
          <div><p className="text-violet-100">Restantes</p><p className="text-2xl font-bold">{Math.max(totalCredits - approvedCredits, 0)}</p></div>
        </div>
      </div>
    </div>
  </div>
);

const statusCards = [
  { key: "approved", label: "Aprobadas", icon: CheckCircleIcon, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "studying", label: "Cursando", icon: ClockIcon, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "pending", label: "Pendientes", icon: XCircleIcon, color: "text-rose-600", bg: "bg-rose-50" },
] as const;

export const StatusSummary = ({ approved, studying, pending }: { approved: number; studying: number; pending: number }) => {
  const values = { approved, studying, pending };
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
    {statusCards.map(({ key, label, icon: Icon, color, bg }) => (
      <div key={key} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${bg} ${color}`}><Icon size={25} weight="fill" /></span>
        <div><p className="text-2xl font-bold leading-none">{values[key]}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>
      </div>
    ))}
  </div>;
};

export const ModuleProgressList = ({ modules }: { modules: ModuleProgress[] }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><h3 className="font-bold">Progreso por módulo</h3><Link to="/materias" className="text-xs font-semibold text-violet-600">Ver materias</Link></div>
    <div className="space-y-5">{modules.map((module) => <div key={module.name}>
      <div className="mb-2 flex justify-between gap-4 text-sm"><span className="font-medium text-slate-700">{module.name}</span><span className="shrink-0 text-slate-500">{module.completed}/{module.total}</span></div>
      <progress className="academic-progress module-progress" value={module.percentage} max="100" />
    </div>)}</div>
  </div>
);

const SubjectRow = ({ subject }: { subject: Subject }) => (
  <div className="flex items-center gap-3 border-b border-slate-100 px-1 py-3 last:border-0">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-600"><BooksIcon size={18} /></span>
    <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{subject.nombre}</p><p className="text-xs text-slate-500">{subject.codigo} · {subject.creditos} créditos</p></div>
  </div>
);

export const CurrentSubjects = ({ subjects, credits }: { subjects: Subject[]; credits: number }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-2 flex items-center justify-between"><div><h3 className="font-bold">Cursando actualmente</h3><p className="text-xs text-slate-500">{credits} créditos en curso</p></div><Link to="/materias" className="flex items-center gap-1 text-xs font-semibold text-violet-600">Ver todas <ArrowRightIcon /></Link></div>
    {subjects.length ? subjects.slice(0, 5).map((subject) => <SubjectRow key={subject.id} subject={subject} />) : <div className="grid min-h-48 place-items-center text-center text-sm text-slate-500"><div><BooksIcon size={32} className="mx-auto mb-2 text-slate-300" /><p>Todavía no marcaste materias en curso.</p></div></div>}
  </div>
);

export const PendingSubjects = ({ subjects }: { subjects: Subject[] }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between"><div><h3 className="font-bold">Próximas materias</h3><p className="text-xs text-slate-500">Una vista rápida de tus materias pendientes</p></div><Link to="/materias" className="text-xs font-semibold text-violet-600">Ver todas</Link></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="border-b border-slate-200 text-xs text-slate-500"><tr><th className="pb-3 font-medium">Código</th><th className="pb-3 font-medium">Materia</th><th className="pb-3 font-medium">Módulo</th><th className="pb-3 font-medium">Créditos</th><th className="pb-3 font-medium">Estado</th></tr></thead><tbody>{subjects.slice(0, 6).map((subject) => <tr key={subject.id} className="border-b border-slate-100 last:border-0"><td className="py-3 text-slate-500">{subject.codigo}</td><td className="py-3 font-medium">{subject.nombre}</td><td className="py-3 text-slate-500">{subject.modulo}</td><td className="py-3">{subject.creditos}</td><td className="py-3"><span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs text-rose-700">Pendiente</span></td></tr>)}</tbody></table></div>
  </section>
);
