import { List, UploadSimple } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

const titles: Record<string, string> = {
  "/": "Inicio",
  "/dashboard": "Dashboard",
  "/materias": "Materias",
  "/correlativas": "Correlativas",
  "/historial": "Historial académico",
  "/import-excel": "Importar plan de estudios",
};

export const Header = ({ onOpenMenu }: { onOpenMenu: () => void }) => {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <List size={24} />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">
          {titles[pathname] ?? "Mi Carrera"}
        </h1>
      </div>
      <Link
        to="/import-excel"
        className="flex items-center gap-2 rounded-xl border border-violet-200 px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 sm:px-4"
      >
        <UploadSimple size={18} />
        <span className="hidden sm:inline">Importar plan (.xlsx)</span>
      </Link>
    </header>
  );
};
