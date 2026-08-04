import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ChatCircleDots, PaperPlaneRight, X } from "@phosphor-icons/react";
import { sendChatMessage } from "../Services/chatService";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const initialMessage: ChatMessage = {
  id: 0,
  role: "assistant",
  content: "¡Hola! Soy tu asistente academico. ¿En que puedo ayudarte?",
};

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: cleanPrompt,
    };

    setMessages((current) => [...current, userMessage]);
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
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Ocurrio un error inesperado",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <section
          aria-label="Asistente academico"
          className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-2xl"
        >
          <header className="flex items-center justify-between bg-green px-4 py-3 text-white">
            <div>
              <h2 className="font-semibold">Asistente academico</h2>
              <p className="text-xs text-white/80">Potenciado por Groq</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/15"
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-beige p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <p
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-green text-white"
                      : "rounded-bl-sm bg-white text-charcoal-gray shadow-sm"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <p className="rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-gray shadow-sm">
                  Pensando...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-black/10 bg-white p-3">
            {error && (
              <p role="alert" className="mb-2 text-xs text-red">
                {error}
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder="Escribi tu consulta..."
                aria-label="Consulta"
                className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-gray/40 bg-white px-3 py-2 text-sm outline-none transition focus:border-green"
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-green text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Enviar consulta"
              >
                <PaperPlaneRight size={19} weight="fill" />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-green text-white shadow-lg transition hover:scale-105 hover:shadow-xl"
        aria-label={isOpen ? "Cerrar asistente" : "Abrir asistente"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={25} /> : <ChatCircleDots size={27} weight="fill" />}
      </button>
    </div>
  );
};
