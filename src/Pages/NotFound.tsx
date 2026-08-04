import {
    ArrowLeftIcon,
    HouseIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import { Link, useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <section className="grid min-h-[calc(100vh-10rem)] place-items-center">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
                <span className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-violet-100 text-violet-700">
                    <WarningCircleIcon size={42} weight="duotone" />
                </span>
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.25em] text-violet-600">
                    Error 404
                </p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Ups! Sucedió un error. No encontramos la página que
                    buscabas.
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    Es posible que la dirección sea incorrecta o que la sección
                    haya cambiado de lugar.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
                    >
                        <HouseIcon size={18} />
                        Volver al inicio
                    </Link>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeftIcon size={18} />
                        Regresar
                    </button>
                </div>
            </div>
        </section>
    );
};
