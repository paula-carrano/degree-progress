export const PageHeader = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);
