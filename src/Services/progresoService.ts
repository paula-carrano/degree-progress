import { supabase } from "./supabaseClient";


export const getProgreso=  async ()=> {
    const {data, error} = await supabase.from('progreso_materia').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export const progresoUpdate = async(materiaId: number, nota: number) => {
    const {data, error} = await supabase
    .from('progreso_materia')
    .upsert({materia_id: materiaId, nota: nota, aprobada: nota >= 4})

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

