import { useState } from "react";
import { supabase } from "../Services/supabaseClient";
import { parseExcelFile } from "../Services/excelService";
import { getOrCreateCarrera } from "../Services/carreraService";

export const ImportExcel = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage("");

    try {
      const json: any[] = await parseExcelFile(file);

      const { data: modulos, error: modError } = await supabase
        .from("modulos")
        .select("*");

      if (modError) throw modError;

      const carrera = await getOrCreateCarrera();

      const materias = json.map((row) => {
        const normalize = (str: string) => str?.trim().toLowerCase();

        const modulo = modulos.find(
          (m: any) => normalize(m.nombre) === normalize(row["Modulo"]),
        );

        const cleanName = row["Materia"]?.split("(")[0]?.trim();

        const codigo = row["Materia"]?.match(/\(([^)]+)\)/)?.[1] || "";

        return {
          nombre: cleanName,
          codigo: codigo,
          creditos: Number(row["Creditos"]),
          modulo_id: modulo?.id,
          carrera_id: carrera.id,
        };
      });

      const materiasValidas = materias.filter((m) => m.nombre && m.modulo_id);

      const { error } = await supabase.from("materias").upsert(materiasValidas);

      if (error) throw error;

      setMessage("Materias importadas correctamente");
    } catch (error) {
      setMessage("Error al importar el Excel");
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
