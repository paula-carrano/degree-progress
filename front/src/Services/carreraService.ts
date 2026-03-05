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