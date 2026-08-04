import {
  CurrentSubjects,
  ModuleProgressList,
  PendingSubjects,
  ProgressOverview,
  StatusSummary,
} from "../Components/Home/HomeSections";
import { PageError, PageLoading } from "../Components/PageState";
import { useAuth } from "../Hooks/useAuth";
import { useAcademicData } from "../Hooks/useAcademicData";
import { useAcademicSummary } from "../Hooks/useAcademicSummary";

export const Home = () => {
  const { subjects, loading, error } = useAcademicData();
  const { user } = useAuth();
  const summary = useAcademicSummary(subjects);

  if (loading) return <PageLoading />;
  if (error) return <PageError message={error} />;

  const userName =
    (user?.user_metadata?.nombre as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "estudiante";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">¡Hola, {userName}! 👋</h2>
        <p className="mt-1 text-sm text-slate-500">Este es el resumen de tu progreso académico.</p>
      </div>

      <section className="space-y-4">
        <ProgressOverview progress={summary.progress} approvedCredits={summary.approvedCredits} totalCredits={summary.totalCredits} />
        <StatusSummary approved={summary.approved.length} studying={summary.studying.length} pending={summary.pending.length} />
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ModuleProgressList modules={summary.modules} />
        <CurrentSubjects subjects={summary.studying} credits={summary.studyingCredits} />
      </section>

      <PendingSubjects subjects={summary.pending} />
    </div>
  );
};
