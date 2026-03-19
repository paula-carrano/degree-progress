import { supabase } from "./supabaseClient";

export const getCarreras = async () => {
    const {data, error} = await supabase.from('carrera').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export const getCarreraById = async (id: number) => {
    const {data, error} = await supabase.from('carrera').select('*').eq('id', id).single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}


export const getOrCreateCarrera = async () => {
    const nombreCarrera= "Tecnicatura en Programacion";

    const {data: existing, error: getError} = await supabase.from('carrera').select('*').eq('nombre', nombreCarrera).single();

    if (existing) return existing;

    const { data: nuevaCarrera, error } = await supabase
      .from("carreras")
      .insert({ nombre: nombreCarrera })
      .select()
      .single();
    
    if (error) throw error;
    
    return nuevaCarrera;
}