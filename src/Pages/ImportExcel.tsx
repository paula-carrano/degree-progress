import { useState } from "react";
import { PageHeader } from "../Components/UI/PageHeader";
import { importStudyPlan } from "../Services/planImportService";

type Feedback = { type: "success" | "error"; text: string } | null;

export const ImportExcel = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setFeedback(null);
    try {
      const result = await importStudyPlan(file);
      setFeedback({ type: "success", text: `${result.subjects} materias y ${result.correlatives} correlativas importadas correctamente` });
    } catch (error) {
      console.error("Error al importar el Excel:", error);
      setFeedback({ type: "error", text: error instanceof Error ? error.message : "No se pudo importar el Excel" });
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader title="Importar plan de estudios" description="Cargá las materias, módulos y correlativas desde tu archivo de Excel." />
      <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-violet-200 bg-white p-8 text-center shadow-sm transition hover:border-violet-400 hover:bg-violet-50/40">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-3xl text-violet-700">↑</span>
        <span className="mt-5 font-bold text-slate-900">{loading ? "Importando el plan..." : "Seleccioná un archivo .xlsx"}</span>
        <span className="mt-2 max-w-md text-sm leading-6 text-slate-500">Debe incluir las columnas Código, Materia, Créditos, Módulo y Correlativas.</span>
        <input type="file" accept=".xlsx, .xls" onChange={(event) => void handleFileUpload(event)} disabled={loading} className="sr-only" />
      </label>
      {feedback && <p className={`rounded-xl border p-4 text-sm ${feedback.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`}>{feedback.text}</p>}
    </div>
  );
};
