import {
  Books,
  ChartDonut,
  ClockCounterClockwise,
  GraduationCap,
  House,
  TreeStructure,
  UploadSimple,
  X,
  SignOut,
} from "@phosphor-icons/react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { to: "/", label: "Inicio", icon: House, end: true },
  { to: "/dashboard", label: "Dashboard", icon: ChartDonut },
  { to: "/materias", label: "Materias", icon: Books },
  { to: "/correlativas", label: "Correlativas", icon: TreeStructure },
  { to: "/historial", label: "Historial", icon: ClockCounterClockwise },
  { to: "/import-excel", label: "Importar plan", icon: UploadSimple },
];

export const Sidebar = ({ open, onClose }: SidebarProps) => {
  const { user, signOut } = useAuth();

  return <>
    {open && (
      <button
        type="button"
        aria-label="Cerrar menú"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-slate-950/30 lg:hidden"
      />
    )}
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-slate-200 bg-white px-3 py-5 transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="mb-8 flex items-center justify-between px-2">
        <div className="flex items-center gap-3 text-violet-700">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100">
            <GraduationCap size={24} weight="duotone" />
          </span>
          <div>
            <p className="font-bold">Mi Carrera</p>
            <p className="text-xs text-slate-500">Degree Progress</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="lg:hidden" aria-label="Cerrar menú">
          <X size={22} />
        </button>
      </div>

      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-violet-100 text-violet-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-violet-100 bg-violet-50 p-4">
        <GraduationCap size={26} className="mb-3 text-violet-600" />
        <p className="text-sm font-semibold text-slate-900">¡Seguí avanzando!</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Cada materia aprobada te acerca un poco más a tu objetivo.
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 p-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
          {user?.email?.charAt(0).toUpperCase() ?? "U"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-slate-700">{user?.email}</p>
          <p className="text-[11px] text-slate-400">Mi progreso</p>
        </div>
        <button type="button" onClick={() => void signOut()} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Cerrar sesión">
          <SignOut size={18} />
        </button>
      </div>
    </aside>
  </>
};
