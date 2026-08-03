import { useEffect, useState } from "react";
import { getMaterias } from "../Services/materiasService";

export const Dashboard = () => {
  const [materias, setMaterias] = useState<any[]>([]);

  useEffect(() => {
    const fetchMaterias = async () => {
      const data = await getMaterias();

      const materiasLimpias = data.map(({ id, nombre, creditos, modulos }) => ({
        id,
        nombre,
        creditos,
        modulo: modulos?.nombre || "Sin módulo",
      }));

      setMaterias(materiasLimpias);
    };

    fetchMaterias();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Materias</h2>

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2 text-left">Nombre</th>
            <th className="border p-2 text-left">Créditos</th>
            <th className="border p-2 text-left">Módulo</th>
          </tr>
        </thead>

        <tbody>
          {materias.map((m) => (
            <tr key={m.id}>
              <td>{m.nombre}</td>
              <td>{m.creditos}</td>
              <td>{m.modulo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
