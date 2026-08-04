import { PageError, PageLoading } from "../Components/PageState";
import { SubjectTable } from "../Components/Subjects/SubjectTable";
import { PageHeader } from "../Components/UI/PageHeader";
import { SearchField } from "../Components/UI/SearchField";
import { useAcademicData } from "../Hooks/useAcademicData";
import { useSubjectFilters } from "../Hooks/useSubjectFilters";
import { useSubjectStatus } from "../Hooks/useSubjectStatus";

export const Materias = () => {
  const { subjects, loading, error, reload } = useAcademicData();
  const filters = useSubjectFilters(subjects);
  const status = useSubjectStatus(reload);

  if (loading && !subjects.length) return <PageLoading />;
  if (error && !subjects.length) return <PageError message={error} />;

  return (
    <div className="space-y-5">
      <PageHeader title="Plan de materias" description="Consultá el plan y actualizá el estado de cada materia." />
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <SearchField value={filters.search} onChange={filters.setSearch} placeholder="Buscar por nombre o código" className="flex-1" />
        <select value={filters.module} onChange={(event) => filters.setModule(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400">
          <option value="todos">Todos los módulos</option>
          {filters.modules.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </div>
      {status.error && <PageError message={status.error} />}
      <SubjectTable subjects={filters.filteredSubjects} savingId={status.savingId} onStatusChange={(id, value) => void status.changeStatus(id, value)} />
    </div>
  );
};
