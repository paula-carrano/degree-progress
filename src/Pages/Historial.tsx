import { CheckCircle } from "@phosphor-icons/react";
import { PageError, PageLoading } from "../Components/PageState";
import { useAcademicData } from "../Hooks/useAcademicData";

export const Historial = () => {
  const { subjects, loading, error } = useAcademicData();
  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const approved = subjects.filter((subject) => subject.estado === "aprobada");
  const credits = approved.reduce((sum, subject) => sum + subject.creditos, 0);

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-bold">Historial académico</h2><p className="mt-1 text-sm text-slate-500">Tus materias aprobadas y los créditos obtenidos.</p></div>
      <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5"><p className="text-sm text-emerald-700">Materias aprobadas</p><p className="mt-1 text-3xl font-bold text-emerald-800">{approved.length}</p></div><div className="rounded-2xl border border-violet-100 bg-violet-50 p-5"><p className="text-sm text-violet-700">Créditos obtenidos</p><p className="mt-1 text-3xl font-bold text-violet-800">{credits}</p></div></div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {approved.map((subject) => <div key={subject.id} className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-0"><CheckCircle size={26} weight="fill" className="shrink-0 text-emerald-500" /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{subject.nombre}</p><p className="text-xs text-slate-500">{subject.codigo} · {subject.modulo}</p></div><div className="text-right"><p className="text-sm font-semibold">{subject.creditos} créditos</p>{subject.nota !== null && <p className="text-xs text-slate-500">Nota: {subject.nota}</p>}</div></div>)}
        {!approved.length && <p className="p-12 text-center text-sm text-slate-500">Cuando marques materias como aprobadas, aparecerán en este historial.</p>}
      </div>
    </div>
  );
};
