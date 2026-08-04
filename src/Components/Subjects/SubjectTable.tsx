import { ACADEMIC_STATUS_LABELS } from "../../Constants/academic";
import type { AcademicStatus, Subject } from "../../Types/academic";
import { EmptyState } from "../UI/EmptyState";

type SubjectTableProps = {
  subjects: Subject[];
  savingId: number | null;
  onStatusChange: (subjectId: number, status: AcademicStatus) => void;
};

export const SubjectTable = ({ subjects, savingId, onStatusChange }: SubjectTableProps) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>{["Código", "Materia", "Módulo", "Créditos", "Estado"].map((heading) => <th key={heading} className="px-5 py-4">{heading}</th>)}</tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id} className="border-t border-slate-100">
              <td className="px-5 py-4 text-slate-500">{subject.codigo}</td>
              <td className="px-5 py-4 font-semibold text-slate-800">{subject.nombre}</td>
              <td className="px-5 py-4 text-slate-500">{subject.modulo}</td>
              <td className="px-5 py-4">{subject.creditos}</td>
              <td className="px-5 py-4">
                <select
                  value={subject.estado}
                  disabled={savingId === subject.id}
                  onChange={(event) => onStatusChange(subject.id, event.target.value as AcademicStatus)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium outline-none focus:border-violet-400 disabled:opacity-50"
                >
                  {Object.entries(ACADEMIC_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {!subjects.length && <EmptyState className="border-0 shadow-none">No encontramos materias con esos filtros.</EmptyState>}
  </div>
);
