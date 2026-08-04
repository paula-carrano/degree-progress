import { useMemo, useState } from "react";
import { CorrelativeCard } from "../Components/Subjects/CorrelativeCard";
import { PageError, PageLoading } from "../Components/PageState";
import { EmptyState } from "../Components/UI/EmptyState";
import { PageHeader } from "../Components/UI/PageHeader";
import { SearchField } from "../Components/UI/SearchField";
import { useAcademicData } from "../Hooks/useAcademicData";
import { buildCorrelativeRows, matchesSubject } from "../Utils/academic";

export const Correlativas = () => {
  const { subjects, correlatives, loading, error } = useAcademicData();
  const [search, setSearch] = useState("");
  const rows = useMemo(
    () => buildCorrelativeRows(subjects, correlatives).filter(({ subject, requirements }) => requirements.length && matchesSubject(subject, search)),
    [subjects, correlatives, search],
  );

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  return (
    <div className="space-y-5">
      <PageHeader title="Correlativas" description="Revisá qué requisitos tiene cada materia del plan." />
      <SearchField value={search} onChange={setSearch} placeholder="Buscar una materia" className="max-w-xl" />
      <div className="grid gap-4 xl:grid-cols-2">{rows.map((row) => <CorrelativeCard key={row.subject.id} {...row} />)}</div>
      {!rows.length && <EmptyState>No encontramos correlativas para mostrar.</EmptyState>}
    </div>
  );
};
