import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../Services/supabaseClient";

export const useAuthForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const setField = (field: keyof typeof fields, value: string) =>
    setFields((current) => ({ ...current, [field]: value }));

  const clearFeedback = () => {
    setError(null);
    setMessage(null);
  };

  const toggleMode = () => {
    setIsRegistering((current) => !current);
    clearFeedback();
  };

  const submit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    clearFeedback();
    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: fields.email,
          password: fields.password,
          options: { data: { nombre: fields.name.trim() } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage("Cuenta creada. Revisá tu correo para confirmar el acceso.");
          return;
        }
        navigate("/", { replace: true });
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: fields.email,
        password: fields.password,
      });
      if (signInError) throw signInError;
      const destination = (location.state as { from?: string } | null)?.from ?? "/";
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo completar el acceso");
    } finally {
      setSubmitting(false);
    }
  };

  return { isRegistering, fields, setField, submitting, message, error, submit, toggleMode };
};
