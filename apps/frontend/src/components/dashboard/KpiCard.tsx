import { ReactNode } from 'react';

export interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: {
    value: string | number;
    type: 'increase' | 'decrease' | 'neutral';
    text?: string;
  };
  icon?: ReactNode;
}

export default function KpiCard({ label, value, delta, icon }: KpiCardProps) {
  const deltaColors = {
    increase: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    decrease: 'bg-red-50 text-red-700 border-red-100',
    neutral: 'bg-slate-50 text-slate-600 border-slate-100'
  };

  const deltaTextPrefix = delta?.type === 'increase' ? '+' : delta?.type === 'decrease' ? '-' : '';

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{label}</span>
        {icon && <div className="text-slate-400 p-1 bg-slate-50 rounded-lg">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between mt-3">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        
        {delta && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${deltaColors[delta.type]}`}>
            {deltaTextPrefix}{delta.value} {delta.text && <span className="text-[9px] font-normal text-slate-400">({delta.text})</span>}
          </span>
        )}
      </div>
    </div>
  );
}
