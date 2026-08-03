import { supabase } from "./supabaseClient";


export const getMaterias = async () => {
    const {data, error} = await supabase.from('materias').select( `id,
      nombre,
      creditos,
      modulos ( nombre )`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const getMateriaByCarrera = async (carreraId: number) => {
    const {data, error} = await supabase.from('materias').select('*').eq('carrera_id', carreraId);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}