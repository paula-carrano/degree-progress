import { CheckCircleIcon } from "@phosphor-icons/react";
import { PageError, PageLoading } from "../Components/PageState";
import { EmptyState } from "../Components/UI/EmptyState";
import { MetricCard } from "../Components/UI/MetricCard";
import { PageHeader } from "../Components/UI/PageHeader";
import { useAcademicData } from "../Hooks/useAcademicData";
import { useAcademicSummary } from "../Hooks/useAcademicSummary";

export const Historial = () => {
  const { subjects, loading, error } = useAcademicData();
  const { approved, approvedCredits } = useAcademicSummary(subjects);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-5">
      <PageHeader title="Historial académico" description="Tus materias aprobadas y los créditos obtenidos." />
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard label="Materias aprobadas" value={approved.length} tone="emerald" />
        <MetricCard label="Créditos obtenidos" value={approvedCredits} tone="violet" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {approved.map((subject) => (
          <div key={subject.id} className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-0">
            <CheckCircleIcon size={26} weight="fill" className="shrink-0 text-emerald-500" />
            <div className="min-w-0 flex-1"><p className="truncate font-semibold">{subject.nombre}</p><p className="text-xs text-slate-500">{subject.codigo} · {subject.modulo}</p></div>
            <div className="text-right"><p className="text-sm font-semibold">{subject.creditos} créditos</p>{subject.nota !== null && <p className="text-xs text-slate-500">Nota: {subject.nota}</p>}</div>
          </div>
        ))}
        {!approved.length && <EmptyState className="border-0 shadow-none">Cuando marques materias como aprobadas, aparecerán en este historial.</EmptyState>}
      </div>
    </div>
  );
};
