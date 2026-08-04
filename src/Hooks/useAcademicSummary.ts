import { useMemo } from "react";
import type { Subject } from "../Types/academic";

export const useAcademicSummary = (subjects: Subject[]) =>
  useMemo(() => {
    const approved = subjects.filter(({ estado }) => estado === "aprobada");
    const studying = subjects.filter(({ estado }) => estado === "cursando");
    const pending = subjects.filter(({ estado }) => estado === "pendiente");
    const totalCredits = subjects.reduce((sum, { creditos }) => sum + creditos, 0);
    const approvedCredits = approved.reduce((sum, { creditos }) => sum + creditos, 0);
    const studyingCredits = studying.reduce((sum, { creditos }) => sum + creditos, 0);

    const modules = Array.from(new Set(subjects.map(({ modulo }) => modulo))).map(
      (name) => {
        const moduleSubjects = subjects.filter(({ modulo }) => modulo === name);
        const completed = moduleSubjects.filter(({ estado }) => estado === "aprobada").length;
        return {
          name,
          completed,
          total: moduleSubjects.length,
          percentage: moduleSubjects.length
            ? Math.round((completed / moduleSubjects.length) * 100)
            : 0,
        };
      },
    );

    return {
      approved,
      studying,
      pending,
      totalCredits,
      approvedCredits,
      studyingCredits,
      progress: totalCredits
        ? Math.round((approvedCredits / totalCredits) * 100)
        : 0,
      modules,
    };
  }, [subjects]);
