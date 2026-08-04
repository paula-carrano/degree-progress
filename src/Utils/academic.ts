import type { Correlative, Subject } from "../Types/academic";

export const matchesSubject = (subject: Subject, search: string) => {
  const term = search.trim().toLocaleLowerCase("es");
  return (
    !term ||
    subject.nombre.toLocaleLowerCase("es").includes(term) ||
    subject.codigo.toLocaleLowerCase("es").includes(term)
  );
};

export const buildCorrelativeRows = (
  subjects: Subject[],
  correlatives: Correlative[],
) => {
  const subjectsById = new Map(subjects.map((subject) => [subject.id, subject]));
  const requirementsBySubject = new Map<number, Subject[]>();

  for (const relation of correlatives) {
    const requirement = subjectsById.get(relation.requisito_id);
    if (!requirement) continue;
    const requirements = requirementsBySubject.get(relation.materia_id) ?? [];
    requirements.push(requirement);
    requirementsBySubject.set(relation.materia_id, requirements);
  }

  return subjects.map((subject) => ({
    subject,
    requirements: requirementsBySubject.get(subject.id) ?? [],
  }));
};
