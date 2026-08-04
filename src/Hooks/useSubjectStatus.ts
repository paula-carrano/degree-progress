import { useState } from "react";
import { setSubjectStatus } from "../Services/academicService";
import type { AcademicStatus } from "../Types/academic";

export const useSubjectStatus = (reload: () => Promise<void>) => {
  const [savingId, setSavingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = async (subjectId: number, status: AcademicStatus) => {
    setSavingId(subjectId);
    setError(null);
    try {
      await setSubjectStatus(subjectId, status);
      await reload();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo actualizar la materia",
      );
    } finally {
      setSavingId(null);
    }
  };

  return { savingId, error, changeStatus };
};
