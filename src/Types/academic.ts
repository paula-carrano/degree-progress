export type AcademicStatus = "pendiente" | "cursando" | "aprobada";

export type Subject = {
  id: number;
  nombre: string;
  codigo: string;
  creditos: number;
  modulo: string;
  estado: AcademicStatus;
  nota: number | null;
  anio: number | null;
  cuatrimestre: number | null;
};

export type Correlative = {
  materia_id: number;
  requisito_id: number;
};

export type AcademicData = {
  subjects: Subject[];
  correlatives: Correlative[];
};
