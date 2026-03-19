export interface SidebarPanelProps {
  criticalAreas?: Array<{ id: string; name: string; risk_score: number; flood_risk_category: string }>;
  events?: Array<{ id: string; description: string; created_at: string; status: string }>;
  onAreaClick?: (id: string) => void;
}

export default function SidebarPanel({ criticalAreas = [], events = [], onAreaClick }: SidebarPanelProps) {
  const badgeColors: Record<string, string> = {
    HIGH: 'bg-red-100 text-red-800 border-red-200',
    MEDIUM: 'bg-amber-100 text-amber-800 border-amber-200',
    LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* 1. Insights Rápidos */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
           <div className="p-2 bg-amber-100 rounded-lg h-fit text-amber-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-3m0 0v-3m0 3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
           </div>
           <div>
                <h4 className="text-xs font-black text-amber-900 uppercase">Insight Operacional</h4>
                <p className="text-xs text-amber-800 leading-relaxed mt-0.5">
                     O volume de chuva acumulado no **Centro** ultrapassou 40mm hoje. Risco de alagamento rápido nas próximas 2h.
                </p>
           </div>
      </div>

      {/* 2. Top Áreas Críticas */}
      <div className="flex flex-col flex-1">
           <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Top Áreas Críticas</h4>
           <div className="space-y-2">
                {criticalAreas.map((area) => (
                     <div key={area.id} onClick={() => onAreaClick && onAreaClick(area.id)} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition cursor-pointer">
                          <div>
                               <p className="text-sm font-bold text-slate-900">{area.name}</p>
                               <p className="text-[10px] text-slate-400">Score de Risco: {area.risk_score.toFixed(1)}</p>
                          </div>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${badgeColors[area.flood_risk_category] || 'bg-slate-50'}`}>
                               {area.flood_risk_category}
                          </span>
                     </div>
                ))}
           </div>
      </div>

      {/* 3. Eventos Recentes (Feed) */}
      <div className="flex flex-col">
           <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Linha do Tempo / Eventos</h4>
           <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-2 before:w-[1px] before:bg-slate-100">
                {events.map((event) => (
                     <div key={event.id} className="flex gap-3 pl-5 relative">
                          {/* Dot item */}
                          <div className={`absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center ${
                               ['VALIDATED', 'RESOLVED'].includes(event.status) ? 'bg-green-500' : 'bg-amber-400'
                          }`}></div>
                          <div>
                               <p className="text-xs font-medium text-slate-700 leading-tight truncate max-w-[250px]">{event.description}</p>
                               <p className="text-[10px] text-slate-400 mt-0.5">{new Date(event.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                     </div>
                ))}
           </div>
      </div>
    </div>
  );
}
