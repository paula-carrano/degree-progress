import { supabase } from "./supabaseClient";
import type {
  AcademicData,
  AcademicStatus,
  Correlative,
  Subject,
} from "../Types/academic";

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

const moduleOrder = [
  "ciclo introductorio",
  "cursos obligatorios",
  "cursos avanzados obligatorios",
  "otros requisitos",
  "cursos complementarios",
];

const moduleName = (relation: ModuleRelation) => {
  if (Array.isArray(relation)) return relation[0]?.nombre ?? "Sin módulo";
  return relation?.nombre ?? "Sin módulo";
};

const normalizeStatus = (progress?: ProgressRow): AcademicStatus => {
  if (progress?.estado === "aprobada" || progress?.aprobada) return "aprobada";
  if (progress?.estado === "cursando") return "cursando";
  return "pendiente";
};

const normalizeModule = (value: string) => value.trim().toLocaleLowerCase("es");

export const getAcademicData = async (): Promise<AcademicData> => {
  const [materiasResult, progresoResult, correlativasResult] = await Promise.all([
    supabase
      .from("materias")
      .select("id, nombre, codigo, creditos, modulos(nombre)"),
    supabase.from("progreso_materia").select("*"),
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
      const aIndex = moduleOrder.indexOf(normalizeModule(a.modulo));
      const bIndex = moduleOrder.indexOf(normalizeModule(b.modulo));
      const aOrder = aIndex < 0 ? moduleOrder.length : aIndex;
      const bOrder = bIndex < 0 ? moduleOrder.length : bIndex;
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
  const { data: existing, error: findError } = await supabase
    .from("progreso_materia")
    .select("id")
    .eq("materia_id", materiaId)
    .maybeSingle();

  if (findError) throw findError;

  const values = {
    materia_id: materiaId,
    estado,
  };

  const result = existing
    ? await supabase.from("progreso_materia").update(values).eq("id", existing.id)
    : await supabase.from("progreso_materia").insert(values);

  if (result.error) throw result.error;
};
