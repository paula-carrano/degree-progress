import { useState } from "react";
import { sendChatMessage } from "../Services/chatService";

export type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const initialMessage: ChatMessage = {
  id: 0,
  role: "assistant",
  content: "¡Hola! Soy tu asistente académico. ¿En qué puedo ayudarte?",
};

export const useChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const send = async () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) return;

    setMessages((current) => [
      ...current,
      { id: Date.now(), role: "user", content: cleanPrompt },
    ]);
    setPrompt("");
    setError(null);
    setIsLoading(true);
    try {
      const response = await sendChatMessage(cleanPrompt);
      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", content: response },
      ]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((current) => !current),
    prompt,
    setPrompt,
    messages,
    isLoading,
    error,
    send,
  };
};
