import { useEffect, useState } from "react";
import { getMaterias } from "../Services/materiasService";

type ModuloRelation = { nombre: string } | { nombre: string }[] | null;

const getModuloNombre = (modulos: ModuloRelation) => {
    if (Array.isArray(modulos)) return modulos[0]?.nombre;
    return modulos?.nombre;
};

const moduleOrder = [
    "ciclo introductorio",
    "cursos obligatorios",
    "cursos avanzados obligatorios",
    "otros requisitos",
    "cursos complementarios",
];

const normalizeModuleName = (name: string) =>
    name.trim().toLocaleLowerCase("es");

export const Dashboard = () => {
    const [materias, setMaterias] = useState<any[]>([]);

    useEffect(() => {
        const fetchMaterias = async () => {
            const data = await getMaterias();

            const materiasLimpias = data
                .map(({ id, nombre, codigo, creditos, modulos }) => ({
                    id,
                    nombre,
                    codigo,
                    creditos,
                    modulo: getModuloNombre(modulos) || "Sin módulo",
                }))
                .sort((a, b) => {
                    const aIndex = moduleOrder.indexOf(
                        normalizeModuleName(a.modulo),
                    );
                    const bIndex = moduleOrder.indexOf(
                        normalizeModuleName(b.modulo),
                    );
                    const aOrder = aIndex === -1 ? moduleOrder.length : aIndex;
                    const bOrder = bIndex === -1 ? moduleOrder.length : bIndex;

                    return (
                        aOrder - bOrder ||
                        a.codigo.localeCompare(b.codigo, "es", {
                            numeric: true,
                            sensitivity: "base",
                        })
                    );
                });

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
