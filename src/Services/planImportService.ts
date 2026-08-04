import { getOrCreateCarrera } from "./carreraService";
import { parseExcelFile } from "./excelService";
import { supabase } from "./supabaseClient";
import { normalizeCode, normalizeText } from "../Utils/text";

type ExcelRow = {
  Codigo?: string | number;
  Código?: string | number;
  Materia?: string;
  Creditos?: string | number;
  Créditos?: string | number;
  Modulo?: string;
  Módulo?: string;
  Correlativas?: string | number;
};

const getCorrelativeCodes = (value: unknown) =>
  String(value ?? "")
    .split(/[,;\s]+/)
    .map(normalizeCode)
    .filter(Boolean);

export const importStudyPlan = async (file: File) => {
  const rows = (await parseExcelFile(file)) as ExcelRow[];
  const { data: modules, error: moduleError } = await supabase.from("modulos").select("*");
  if (moduleError) throw moduleError;

  const career = await getOrCreateCarrera();
  const subjects = rows.map((row) => {
    const moduleName = row.Modulo ?? row.Módulo;
    const module = modules.find((item) => normalizeText(item.nombre) === normalizeText(moduleName));
    return {
      nombre: row.Materia?.trim(),
      codigo: normalizeCode(row.Codigo ?? row.Código),
      creditos: Number(row.Creditos ?? row.Créditos),
      modulo_id: module?.id,
      carrera_id: career.id,
    };
  });

  const validSubjects = subjects.filter(
    (subject) => subject.nombre && subject.codigo && subject.modulo_id && Number.isFinite(subject.creditos),
  );
  if (!validSubjects.length) {
    throw new Error("No se encontraron materias válidas. Revisá las columnas Código, Materia, Créditos y Módulo.");
  }

  const { error: upsertError } = await supabase
    .from("materias")
    .upsert(validSubjects, { onConflict: "carrera_id,codigo" });
  if (upsertError) throw upsertError;

  const { data: storedSubjects, error: subjectError } = await supabase
    .from("materias")
    .select("id, codigo")
    .eq("carrera_id", career.id);
  if (subjectError) throw subjectError;

  const subjectIdByCode = new Map(
    storedSubjects.map((subject) => [normalizeCode(subject.codigo), subject.id]),
  );
  const correlatives = rows.flatMap((row) => {
    const subjectId = subjectIdByCode.get(normalizeCode(row.Codigo ?? row.Código));
    if (!subjectId) return [];
    return getCorrelativeCodes(row.Correlativas).flatMap((requirementCode) => {
      const requirementId = subjectIdByCode.get(requirementCode);
      return requirementId
        ? [{ materia_id: subjectId, requisito_id: requirementId }]
        : [];
    });
  });
  const importedIds = validSubjects
    .map((subject) => subjectIdByCode.get(normalizeCode(subject.codigo)))
    .filter((id): id is number => id !== undefined);

  if (importedIds.length) {
    const { error } = await supabase.from("correlativas").delete().in("materia_id", importedIds);
    if (error) throw error;
  }
  if (correlatives.length) {
    const { error } = await supabase
      .from("correlativas")
      .upsert(correlatives, { onConflict: "materia_id,requisito_id" });
    if (error) throw error;
  }

  return { subjects: validSubjects.length, correlatives: correlatives.length };
};
