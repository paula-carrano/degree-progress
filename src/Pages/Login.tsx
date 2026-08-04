import { useState } from "react";
import type { FormEvent } from "react";
import { Envelope, GraduationCap, Lock } from "@phosphor-icons/react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { supabase } from "../Services/supabaseClient";

export const Login = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!loading && user) return <Navigate to="/" replace />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage("Cuenta creada. Revisá tu correo para confirmar el acceso.");
        } else {
          navigate("/", { replace: true });
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        const destination = (location.state as { from?: string } | null)?.from ?? "/";
        navigate(destination, { replace: true });
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No se pudo completar el acceso");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
      <section className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-7 shadow-2xl shadow-violet-200/50 sm:p-9">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-violet-700"><GraduationCap size={34} weight="duotone" /></span>
          <h1 className="mt-5 text-2xl font-bold">Mi Carrera</h1>
          <p className="mt-2 text-sm text-slate-500">{isRegistering ? "Creá tu espacio académico personal" : "Ingresá para ver tu progreso académico"}</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block"><span className="mb-1.5 block text-sm font-medium">Correo electrónico</span><span className="relative block"><Envelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="email" required autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-500" placeholder="nombre@correo.com" /></span></label>
          <label className="block"><span className="mb-1.5 block text-sm font-medium">Contraseña</span><span className="relative block"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="password" required minLength={6} autoComplete={isRegistering ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-500" placeholder="Mínimo 6 caracteres" /></span></label>
          {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:opacity-50">{submitting ? "Procesando..." : isRegistering ? "Crear cuenta" : "Ingresar"}</button>
        </form>

        <button type="button" onClick={() => { setIsRegistering((value) => !value); setError(null); setMessage(null); }} className="mt-6 w-full text-sm font-medium text-violet-700 hover:underline">{isRegistering ? "Ya tengo una cuenta" : "Soy una persona nueva"}</button>
      </section>
    </main>
  );
};
