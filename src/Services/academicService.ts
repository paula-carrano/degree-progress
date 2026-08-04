import { supabase } from "./supabaseClient";
import type {
  AcademicData,
  AcademicStatus,
  Correlative,
  Subject,
} from "../Types/academic";
import { MODULE_ORDER } from "../Constants/academic";
import { normalizeText } from "../Utils/text";

type ModuleRelation = { nombre: string } | { nombre: string }[] | null;

type ProgressRow = {
  id?: number;
  materia_id: number;
  estado?: string | null;
  aprobada?: boolean | null;
  nota?: number | null;
  anio?: number | null;
  cuatrimestre?: number | null;
};

const moduleName = (relation: ModuleRelation) => {
  if (Array.isArray(relation)) return relation[0]?.nombre ?? "Sin módulo";
  return relation?.nombre ?? "Sin módulo";
};

const normalizeStatus = (progress?: ProgressRow): AcademicStatus => {
  if (progress?.estado === "aprobada" || progress?.aprobada) return "aprobada";
  if (progress?.estado === "cursando") return "cursando";
  return "pendiente";
};

export const getAcademicData = async (): Promise<AcademicData> => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("No hay una sesión activa");

  const [materiasResult, progresoResult, correlativasResult] = await Promise.all([
    supabase
      .from("materias")
      .select("id, nombre, codigo, creditos, modulos(nombre)"),
    supabase
      .from("progreso_materia")
      .select("*")
      .eq("user_id", authData.user.id),
    supabase.from("correlativas").select("materia_id, requisito_id"),
  ]);

  if (materiasResult.error) throw materiasResult.error;
  if (progresoResult.error) throw progresoResult.error;
  if (correlativasResult.error) throw correlativasResult.error;

  const progressBySubject = new Map<number, ProgressRow>();
  for (const row of (progresoResult.data ?? []) as ProgressRow[]) {
    progressBySubject.set(row.materia_id, row);
  }

  const subjects: Subject[] = (materiasResult.data ?? [])
    .map((row) => {
      const progress = progressBySubject.get(row.id);
      return {
        id: row.id,
        nombre: row.nombre,
        codigo: row.codigo,
        creditos: row.creditos,
        modulo: moduleName(row.modulos as ModuleRelation),
        estado: normalizeStatus(progress),
        nota: progress?.nota ?? null,
        anio: progress?.anio ?? null,
        cuatrimestre: progress?.cuatrimestre ?? null,
      };
    })
    .sort((a, b) => {
      const aIndex = MODULE_ORDER.indexOf(normalizeText(a.modulo));
      const bIndex = MODULE_ORDER.indexOf(normalizeText(b.modulo));
      const aOrder = aIndex < 0 ? MODULE_ORDER.length : aIndex;
      const bOrder = bIndex < 0 ? MODULE_ORDER.length : bIndex;
      return (
        aOrder - bOrder ||
        a.codigo.localeCompare(b.codigo, "es", { numeric: true })
      );
    });

  return {
    subjects,
    correlatives: (correlativasResult.data ?? []) as Correlative[],
  };
};

export const setSubjectStatus = async (
  materiaId: number,
  estado: AcademicStatus,
) => {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) throw new Error("No hay una sesión activa");

  const values = {
    materia_id: materiaId,
    user_id: authData.user.id,
    estado,
  };

  const result = await supabase
    .from("progreso_materia")
    .upsert(values, { onConflict: "user_id,materia_id" });

  if (result.error) throw result.error;
};
