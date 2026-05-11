interface StatCardProps {
  count: number|string;
  label: string;
  colorClass: string;
}

export const StatCard = ({ count, label, colorClass }: StatCardProps) => (
  <div className="bg-white/80 backdrop-blur px-6 py-3 rounded-2xl shadow-sm border border-orange-50 text-center min-w-[120px]">
    <span className={`block text-3xl font-bold ${colorClass}`}>{count}</span>
    <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">{label}</span>
  </div>
);

export default StatCard;