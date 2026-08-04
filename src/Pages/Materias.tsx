import { useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { PageError, PageLoading } from "../Components/PageState";
import { useAcademicData } from "../Hooks/useAcademicData";
import { setSubjectStatus } from "../Services/academicService";
import type { AcademicStatus } from "../Types/academic";

const statusLabel: Record<AcademicStatus, string> = {
  pendiente: "Pendiente",
  cursando: "Cursando",
  aprobada: "Aprobada",
};

export const Materias = () => {
  const { subjects, loading, error, reload } = useAcademicData();
  const [search, setSearch] = useState("");
  const [module, setModule] = useState("todos");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const modules = Array.from(new Set(subjects.map((subject) => subject.modulo)));
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    return subjects.filter(
      (subject) =>
        (module === "todos" || subject.modulo === module) &&
        (!term ||
          subject.nombre.toLocaleLowerCase("es").includes(term) ||
          subject.codigo.toLocaleLowerCase("es").includes(term)),
    );
  }, [subjects, search, module]);

  const changeStatus = async (materiaId: number, estado: AcademicStatus) => {
    setSavingId(materiaId);
    setActionError(null);
    try {
      await setSubjectStatus(materiaId, estado);
      await reload();
    } catch (requestError) {
      setActionError(requestError instanceof Error ? requestError.message : "No se pudo actualizar la materia");
    } finally {
      setSavingId(null);
    }
  };

  if (loading && !subjects.length) return <PageLoading />;
  if (error && !subjects.length) return <PageError message={error} />;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-bold">Plan de materias</h2><p className="mt-1 text-sm text-slate-500">Consultá el plan y actualizá el estado de cada materia.</p></div>
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
        <label className="relative flex-1"><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre o código" className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-violet-400" /></label>
        <select value={module} onChange={(event) => setModule(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-400"><option value="todos">Todos los módulos</option>{modules.map((name) => <option key={name} value={name}>{name}</option>)}</select>
      </div>
      {actionError && <PageError message={actionError} />}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Código</th><th className="px-5 py-4">Materia</th><th className="px-5 py-4">Módulo</th><th className="px-5 py-4">Créditos</th><th className="px-5 py-4">Estado</th></tr></thead>
            <tbody>{filtered.map((subject) => <tr key={subject.id} className="border-t border-slate-100"><td className="px-5 py-4 text-slate-500">{subject.codigo}</td><td className="px-5 py-4 font-semibold text-slate-800">{subject.nombre}</td><td className="px-5 py-4 text-slate-500">{subject.modulo}</td><td className="px-5 py-4">{subject.creditos}</td><td className="px-5 py-4"><select value={subject.estado} disabled={savingId === subject.id} onChange={(event) => void changeStatus(subject.id, event.target.value as AcademicStatus)} className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium outline-none focus:border-violet-400 disabled:opacity-50">{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></td></tr>)}</tbody>
          </table>
        </div>
        {!filtered.length && <p className="p-10 text-center text-sm text-slate-500">No encontramos materias con esos filtros.</p>}
      </div>
    </div>
  );
};
