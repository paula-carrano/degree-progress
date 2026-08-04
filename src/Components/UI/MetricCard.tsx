type MetricCardProps = {
  label: string;
  value: number;
  tone: "emerald" | "violet";
};

const tones = {
  emerald: "border-emerald-100 bg-emerald-50 text-emerald-800",
  violet: "border-violet-100 bg-violet-50 text-violet-800",
};

export const MetricCard = ({ label, value, tone }: MetricCardProps) => (
  <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
    <p className="text-sm opacity-80">{label}</p>
    <p className="mt-1 text-3xl font-bold">{value}</p>
  </div>
);
