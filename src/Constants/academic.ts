import type { AcademicStatus } from "../Types/academic";

export const ACADEMIC_STATUS_LABELS: Record<AcademicStatus, string> = {
  pendiente: "Pendiente",
  cursando: "Cursando",
  aprobada: "Aprobada",
};

export const MODULE_ORDER = [
  "ciclo introductorio",
  "cursos obligatorios",
  "cursos avanzados obligatorios",
  "otros requisitos",
  "cursos complementarios",
];
