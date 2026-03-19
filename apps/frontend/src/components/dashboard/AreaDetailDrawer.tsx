export interface AreaDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  areaData?: {
    name: string;
    description: string;
    risk_score: number;
    risk_category: string;
  } | null;
}

export default function AreaDetailDrawer({ isOpen, onClose, areaData }: AreaDetailDrawerProps) {
  if (!isOpen) return null;

  const data = areaData || {
    name: 'Centro Histórico',
    description: 'Área comercial densa com topografia propensa a alagamentos rápidos e refluxo de maré nas galerias pluviais antigas.',
    risk_score: 8.5,
    risk_category: 'HIGH'
  };

  const badgeColors: Record<string, string> = {
    HIGH: 'bg-red-50 text-red-700 border-red-100',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100',
    LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100'
  };

  return (
    <div className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl transition-transform duration-300 ease-in-out z-[99999] border-l border-slate-100 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      
      {/* 1. Header institucional */}
      <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
           <div>
                <h2 className="text-lg font-black">{data.name}</h2>
                <p className="text-xs text-slate-400">Rio de Janeiro, RJ</p>
           </div>
           <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full text-white/80 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
           </button>
      </div>

      {/* 2. Conteúdo Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm">
           {/* Resumo Score */}
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-wide">Score de Risco</p>
                     <p className="text-2xl font-black text-slate-900 mt-0.5">{data.risk_score.toFixed(1)}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-black border ${badgeColors[data.risk_category]}`}>
                     {data.risk_category}
                </span>
           </div>

           {/* Descrição */}
           <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1">Sobre o local</h4>
                <p className="text-slate-600 leading-relaxed text-xs">{data.description}</p>
           </div>

           {/* Relatos Recentes (Mock) */}
           <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2 flex items-center justify-between">
                     Relatos Recentes
                     <span className="bg-slate-100 text-slate-600 text-[9px] px-1.5 py-0.5 rounded-full">2 novos</span>
                </h4>
                <div className="space-y-2">
                     <div className="p-2 border border-slate-100 rounded-lg text-xs hover:bg-slate-50 transition">
                          <p className="font-semibold text-slate-800">Acúmulo de lixo na vala</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">10m atrás por Morador</p>
                     </div>
                     <div className="p-2 border border-slate-100 rounded-lg text-xs hover:bg-slate-50 transition">
                          <p className="font-semibold text-slate-800">Boca de lobo sem grelha</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">2h atrás por Líder Comunitário</p>
                     </div>
                </div>
           </div>

           {/* Incidentes Críticos */}
           <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">Incidentes Abertos</h4>
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                     <p className="text-xs font-bold text-red-900 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                          </svg>
                          Alagamento em Pista da Av. Principal
                     </p>
                     <p className="text-[10px] text-red-700 mt-1 leading-relaxed">Status: Equipes de trânsito em deslocamento. Motoristas devem evitar a região.</p>
                </div>
           </div>

           {/* Intervenções/Obras */}
           <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">Intervenções</h4>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                     <p className="text-xs font-bold text-blue-900">Limpeza de Galerias Pluviais</p>
                     <p className="text-[10px] text-blue-700 mt-0.5">Secretaria de Conservação (Seconserva)</p>
                     <div className="flex items-center gap-2 mt-2">
                          <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                          <span className="text-[10px] font-bold text-blue-800">45%</span>
                     </div>
                </div>
           </div>

           {/* Ações Rápidas do Gestor */}
           <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Ações do Território</h4>
                <div className="grid grid-cols-2 gap-2">
                     <button className="flex items-center justify-center p-2.5 bg-slate-900 text-white text-[11px] font-bold rounded-xl hover:bg-slate-800 gap-1.5 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                          </svg>
                          Alertar Área
                     </button>
                     <button className="flex items-center justify-center p-2.5 bg-white border border-slate-200 text-slate-800 text-[11px] font-bold rounded-xl hover:bg-slate-50 gap-1.5 shadow-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                          </svg>
                          Histórico
                     </button>
                </div>
           </div>
      </div>
    </div>
  );
}
