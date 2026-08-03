import { supabase } from "./supabaseClient";

export const getCarreras = async () => {
    const {data, error} = await supabase.from('carreras').select('*');

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export const getCarreraById = async (id: number) => {
    const {data, error} = await supabase.from('carreras').select('*').eq('id', id).single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const getOrCreateCarrera = async () => {
  const nombreCarrera = "Tecnicatura en programacion";

  const normalize = (str: string) =>
    str.trim().toLowerCase();

  const { data: carreras, error } = await supabase
    .from("carreras")
    .select("*");

  if (error) throw error;

  const existing = carreras.find(
    (c) => normalize(c.nombre) === normalize(nombreCarrera)
  );

  if (existing) return existing;

  const { data: nuevaCarrera, error: insertError } =
    await supabase
      .from("carreras")
      .insert({ nombre: nombreCarrera })
      .select()
      .single();

  if (insertError) throw insertError;

  return nuevaCarrera;
};