import {
    ArrowRightIcon,
    BooksIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { PageError, PageLoading } from "../Components/PageState";
import { useAcademicData } from "../Hooks/useAcademicData";
import type { Subject } from "../Types/academic";

const statusStyles = {
    aprobada: "bg-emerald-50 text-emerald-700",
    cursando: "bg-amber-50 text-amber-700",
    pendiente: "bg-rose-50 text-rose-700",
};

const ProgressRing = ({ value }: { value: number }) => (
    <div
        className="grid h-28 w-28 place-items-center rounded-full"
        style={{
            background: `conic-gradient(#6d4ce8 ${value}%, #e9e7f5 ${value}% 100%)`,
        }}
    >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-2xl font-bold text-slate-900">
            {value}%
        </div>
    </div>
);

const SubjectRow = ({ subject }: { subject: Subject }) => (
    <div className="flex items-center gap-3 border-b border-slate-100 px-1 py-3 last:border-0">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-violet-100 text-violet-600">
            <BooksIcon size={18} />
        </span>
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">
                {subject.nombre}
            </p>
            <p className="text-xs text-slate-500">
                {subject.codigo} · {subject.creditos} créditos
            </p>
        </div>
    </div>
);

export const Dashboard = () => {
    const { subjects, loading, error } = useAcademicData();

    if (loading) return <PageLoading />;
    if (error) return <PageError message={error} />;

    const approved = subjects.filter(
        (subject) => subject.estado === "aprobada",
    );
    const studying = subjects.filter(
        (subject) => subject.estado === "cursando",
    );
    const pending = subjects.filter(
        (subject) => subject.estado === "pendiente",
    );
    const totalCredits = subjects.reduce(
        (sum, subject) => sum + subject.creditos,
        0,
    );
    const approvedCredits = approved.reduce(
        (sum, subject) => sum + subject.creditos,
        0,
    );
    const studyingCredits = studying.reduce(
        (sum, subject) => sum + subject.creditos,
        0,
    );
    const progress = totalCredits
        ? Math.round((approvedCredits / totalCredits) * 100)
        : 0;

    const modules = Array.from(
        new Set(subjects.map((subject) => subject.modulo)),
    ).map((module) => {
        const moduleSubjects = subjects.filter(
            (subject) => subject.modulo === module,
        );
        const completed = moduleSubjects.filter(
            (subject) => subject.estado === "aprobada",
        ).length;
        return {
            name: module,
            completed,
            total: moduleSubjects.length,
            percentage: moduleSubjects.length
                ? Math.round((completed / moduleSubjects.length) * 100)
                : 0,
        };
    });

    const statusCards = [
        {
            label: "Aprobadas",
            value: approved.length,
            icon: CheckCircleIcon,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Cursando",
            value: studying.length,
            icon: ClockIcon,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: "Pendientes",
            value: pending.length,
            icon: XCircleIcon,
            color: "text-rose-600",
            bg: "bg-rose-50",
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    ¡Hola! 👋
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Este es el resumen de tu progreso académico.
                </p>
            </div>

            <section className="space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-600 p-6 text-white shadow-lg shadow-violet-200 sm:p-8">
                    <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <p className="text-sm text-violet-100">
                                Progreso general
                            </p>
                            <p className="mt-2 text-5xl font-bold">
                                {progress}%
                            </p>
                            <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/25">
                                <div
                                    className="h-full rounded-full bg-emerald-400"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="mt-2 text-sm text-violet-100">
                                {approvedCredits} / {totalCredits} créditos
                            </p>
                        </div>
                        <div className="grid grid-cols-[auto_1px_auto] items-center gap-6">
                            <ProgressRing value={progress} />
                            <div className="h-24 bg-white/20" />
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-violet-100">Aprobados</p>
                                    <p className="text-2xl font-bold text-emerald-300">
                                        {approvedCredits}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-violet-100">Restantes</p>
                                    <p className="text-2xl font-bold">
                                        {Math.max(
                                            totalCredits - approvedCredits,
                                            0,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {statusCards.map(
                        ({ label, value, icon: Icon, color, bg }) => (
                            <div
                                key={label}
                                className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <span
                                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${bg} ${color}`}
                                >
                                    <Icon size={25} weight="fill" />
                                </span>
                                <div>
                                    <p className="text-2xl font-bold leading-none">
                                        {value}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {label}
                                    </p>
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold">Progreso por módulo</h3>
                        <Link
                            to="/materias"
                            className="text-xs font-semibold text-violet-600"
                        >
                            Ver materias
                        </Link>
                    </div>
                    <div className="space-y-5">
                        {modules.map((module) => (
                            <div key={module.name}>
                                <div className="mb-2 flex justify-between gap-4 text-sm">
                                    <span className="font-medium text-slate-700">
                                        {module.name}
                                    </span>
                                    <span className="shrink-0 text-slate-500">
                                        {module.completed}/{module.total}
                                    </span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-violet-600"
                                        style={{
                                            width: `${module.percentage}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h3 className="font-bold">Cursando actualmente</h3>
                            <p className="text-xs text-slate-500">
                                {studyingCredits} créditos en curso
                            </p>
                        </div>
                        <Link
                            to="/materias"
                            className="flex items-center gap-1 text-xs font-semibold text-violet-600"
                        >
                            Ver todas <ArrowRightIcon />
                        </Link>
                    </div>
                    {studying.length ? (
                        studying
                            .slice(0, 5)
                            .map((subject) => (
                                <SubjectRow
                                    key={subject.id}
                                    subject={subject}
                                />
                            ))
                    ) : (
                        <div className="grid min-h-48 place-items-center text-center text-sm text-slate-500">
                            <div>
                                <BooksIcon
                                    size={32}
                                    className="mx-auto mb-2 text-slate-300"
                                />
                                <p>Todavía no marcaste materias en curso.</p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold">Próximas materias</h3>
                        <p className="text-xs text-slate-500">
                            Una vista rápida de tus materias pendientes
                        </p>
                    </div>
                    <Link
                        to="/materias"
                        className="text-xs font-semibold text-violet-600"
                    >
                        Ver todas
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead className="border-b border-slate-200 text-xs text-slate-500">
                            <tr>
                                <th className="pb-3 font-medium">Código</th>
                                <th className="pb-3 font-medium">Materia</th>
                                <th className="pb-3 font-medium">Módulo</th>
                                <th className="pb-3 font-medium">Créditos</th>
                                <th className="pb-3 font-medium">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pending.slice(0, 6).map((subject) => (
                                <tr
                                    key={subject.id}
                                    className="border-b border-slate-100 last:border-0"
                                >
                                    <td className="py-3 text-slate-500">
                                        {subject.codigo}
                                    </td>
                                    <td className="py-3 font-medium">
                                        {subject.nombre}
                                    </td>
                                    <td className="py-3 text-slate-500">
                                        {subject.modulo}
                                    </td>
                                    <td className="py-3">{subject.creditos}</td>
                                    <td className="py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs ${statusStyles[subject.estado]}`}
                                        >
                                            Pendiente
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};
