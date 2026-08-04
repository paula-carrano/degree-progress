import { useState } from "react";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { PageError, PageLoading } from "../Components/PageState";
import { useAcademicData } from "../Hooks/useAcademicData";

export const Correlativas = () => {
  const { subjects, correlatives, loading, error } = useAcademicData();
  const [search, setSearch] = useState("");

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const byId = new Map(subjects.map((subject) => [subject.id, subject]));
  const term = search.trim().toLocaleLowerCase("es");
  const rows = subjects
    .map((subject) => ({
      subject,
      requirements: correlatives
        .filter((relation) => relation.materia_id === subject.id)
        .map((relation) => byId.get(relation.requisito_id))
        .filter((item) => item !== undefined),
    }))
    .filter(({ requirements, subject }) => requirements.length && (!term || subject.nombre.toLocaleLowerCase("es").includes(term) || subject.codigo.toLocaleLowerCase("es").includes(term)));

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-bold">Correlativas</h2><p className="mt-1 text-sm text-slate-500">Revisá qué requisitos tiene cada materia del plan.</p></div>
      <label className="relative block max-w-xl"><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar una materia" className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm shadow-sm outline-none focus:border-violet-400" /></label>
      <div className="grid gap-4 xl:grid-cols-2">
        {rows.map(({ subject, requirements }) => (
          <article key={subject.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4"><span className="text-xs font-semibold text-violet-600">{subject.codigo}</span><h3 className="mt-1 font-bold text-slate-900">{subject.nombre}</h3></div>
            <div className="space-y-2">{requirements.map((requirement) => <div key={requirement.id} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm"><span className="rounded-lg bg-violet-100 px-2 py-1 text-xs font-semibold text-violet-700">{requirement.codigo}</span><span className="flex-1 font-medium">{requirement.nombre}</span><ArrowRight className="text-slate-300" /></div>)}</div>
          </article>
        ))}
      </div>
      {!rows.length && <p className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">No encontramos correlativas para mostrar.</p>}
    </div>
  );
};
