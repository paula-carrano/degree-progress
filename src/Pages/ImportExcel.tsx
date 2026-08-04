import { useState } from "react";
import { supabase } from "../Services/supabaseClient";
import { parseExcelFile } from "../Services/excelService";
import { getOrCreateCarrera } from "../Services/carreraService";

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

const normalizeText = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("es");

// Permite relacionar 00487 (en Codigo) con 487 (en Correlativas).
const normalizeCode = (value: unknown) => {
  const code = String(value ?? "").trim().toUpperCase();
  return /^\d+$/.test(code) ? String(Number(code)) : code;
};

const getCorrelativeCodes = (value: unknown) =>
  String(value ?? "")
    .split(/[,;\s]+/)
    .map(normalizeCode)
    .filter(Boolean);

export const ImportExcel = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const json = (await parseExcelFile(file)) as ExcelRow[];

      const { data: modulos, error: modError } = await supabase
        .from("modulos")
        .select("*");

      if (modError) throw modError;

      const carrera = await getOrCreateCarrera();

      const materias = json.map((row) => {
        const moduloNombre = row.Modulo ?? row.Módulo;
        const modulo = modulos.find(
          (m) => normalizeText(m.nombre) === normalizeText(moduloNombre),
        );

        const cleanName = row.Materia?.trim();
        const codigo = normalizeCode(row.Codigo ?? row.Código);

        return {
          nombre: cleanName,
          codigo,
          creditos: Number(row.Creditos ?? row.Créditos),
          modulo_id: modulo?.id,
          carrera_id: carrera.id,
        };
      });

      const materiasValidas = materias.filter(
        (m) => m.nombre && m.codigo && m.modulo_id && Number.isFinite(m.creditos),
      );

      if (!materiasValidas.length) {
        throw new Error(
          "No se encontraron materias validas. Revisa las columnas Codigo, Materia, Creditos y Modulo.",
        );
      }

      const { error } = await supabase
        .from("materias")
        .upsert(materiasValidas, { onConflict: "carrera_id,codigo" });

      if (error) throw error;

      const { data: materiasGuardadas, error: materiasError } = await supabase
        .from("materias")
        .select("id, codigo")
        .eq("carrera_id", carrera.id);

      if (materiasError) throw materiasError;

      const materiaIdByCode = new Map(
        materiasGuardadas.map((materia) => [
          normalizeCode(materia.codigo),
          materia.id,
        ]),
      );

      const correlativas = json.flatMap((row) => {
        const materiaCode = normalizeCode(row.Codigo ?? row.Código);
        const materiaId = materiaIdByCode.get(materiaCode);

        if (!materiaId) return [];

        return getCorrelativeCodes(row.Correlativas).flatMap(
          (requisitoCode) => {
            const requisitoId = materiaIdByCode.get(requisitoCode);
            return requisitoId
              ? [{ materia_id: materiaId, requisito_id: requisitoId }]
              : [];
          },
        );
      });

      const importedMateriaIds = materiasValidas
        .map((materia) => materiaIdByCode.get(normalizeCode(materia.codigo)))
        .filter((id): id is number => id !== undefined);

      if (importedMateriaIds.length) {
        const { error: deleteError } = await supabase
          .from("correlativas")
          .delete()
          .in("materia_id", importedMateriaIds);

        if (deleteError) throw deleteError;
      }

      if (correlativas.length) {
        const { error: correlativasError } = await supabase
          .from("correlativas")
          .upsert(correlativas, {
            onConflict: "materia_id,requisito_id",
          });

        if (correlativasError) throw correlativasError;
      }

      setMessage(
        `${materiasValidas.length} materias y ${correlativas.length} correlativas importadas correctamente`,
      );
    } catch (error) {
      console.error("Error al importar el Excel:", error);
      setMessage(
        error instanceof Error
          ? `Error al importar: ${error.message}`
          : "Error al importar el Excel",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Importar plan de estudios</h2>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {loading && <p>Cargando...</p>}
      {message && <p>{message}</p>}
    </div>
  );
};
