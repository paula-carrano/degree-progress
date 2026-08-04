import { supabase } from "./supabaseClient";

const functionName = import.meta.env.VITE_GROQ_FUNCTION_NAME || "groq-chat";

export const sendChatMessage = async (prompt: string): Promise<string> => {
  const { data, error } = await supabase.functions.invoke(functionName, {
    body: { prompt },
  });

  if (error) {
    throw new Error(error.message || "No se pudo contactar al asistente");
  }

  if (typeof data?.response !== "string" || !data.response.trim()) {
    throw new Error("El asistente no devolvio una respuesta valida");
  }

  return data.response.trim();
};
