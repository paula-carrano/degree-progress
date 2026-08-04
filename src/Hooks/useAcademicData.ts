import { useCallback, useEffect, useState } from "react";
import { getAcademicData } from "../Services/academicService";
import type { AcademicData } from "../Types/academic";

const emptyData: AcademicData = { subjects: [], correlatives: [] };

export const useAcademicData = () => {
  const [data, setData] = useState<AcademicData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await getAcademicData());
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo cargar la información académica",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { ...data, loading, error, reload };
};
