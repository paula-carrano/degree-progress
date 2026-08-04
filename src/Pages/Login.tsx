import {
  EnvelopeIcon,
  GraduationCapIcon,
  LockIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { Navigate } from "react-router-dom";
import { AuthField } from "../Components/Auth/AuthField";
import { useAuth } from "../Hooks/useAuth";
import { useAuthForm } from "../Hooks/useAuthForm";

export const Login = () => {
  const { user, loading } = useAuth();
  const form = useAuthForm();

  if (!loading && user) return <Navigate to="/" replace />;

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
      <section className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-7 shadow-2xl shadow-violet-200/50 sm:p-9">
        <div className="mb-8 text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-violet-100 text-violet-700"><GraduationCapIcon size={34} weight="duotone" /></span>
          <h1 className="mt-5 text-2xl font-bold">Mi Carrera</h1>
          <p className="mt-2 text-sm text-slate-500">{form.isRegistering ? "Creá tu espacio académico personal" : "Ingresá para ver tu progreso académico"}</p>
        </div>

        <form onSubmit={(event) => void form.submit(event)} className="space-y-4">
          {form.isRegistering && <AuthField label="Nombre" icon={<UserIcon />} type="text" minLength={2} autoComplete="name" value={form.fields.name} onChange={(value) => form.setField("name", value)} placeholder="¿Cómo te llamás?" />}
          <AuthField label="Correo electrónico" icon={<EnvelopeIcon />} type="email" autoComplete="email" value={form.fields.email} onChange={(value) => form.setField("email", value)} placeholder="nombre@correo.com" />
          <AuthField label="Contraseña" icon={<LockIcon />} type="password" minLength={6} autoComplete={form.isRegistering ? "new-password" : "current-password"} value={form.fields.password} onChange={(value) => form.setField("password", value)} placeholder="Mínimo 6 caracteres" />
          {form.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{form.error}</p>}
          {form.message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{form.message}</p>}
          <button type="submit" disabled={form.submitting} className="w-full rounded-xl bg-violet-700 px-4 py-3 font-semibold text-white transition hover:bg-violet-800 disabled:opacity-50">{form.submitting ? "Procesando..." : form.isRegistering ? "Crear cuenta" : "Ingresar"}</button>
        </form>

        <button type="button" onClick={form.toggleMode} className="mt-6 w-full text-sm font-medium text-violet-700 hover:underline">{form.isRegistering ? "Ya tengo una cuenta" : "Soy una persona nueva"}</button>
      </section>
    </main>
  );
};
