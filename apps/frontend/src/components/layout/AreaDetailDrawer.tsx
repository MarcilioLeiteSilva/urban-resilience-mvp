import { useAreaDetail } from '@/hooks/useAreaDetail';
import { AreaDetailed, IncidentItem, InterventionItem } from '@/types/area';

interface DrawerProps {
  areaId: string | null;
  onClose: () => void;
}

export default function AreaDetailDrawer({ areaId, onClose }: DrawerProps) {
  const { area, loading, error } = useAreaDetail(areaId);

  if (!areaId) return null;

  return (
    <div className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl transition-transform transform ${areaId ? 'translate-x-0' : 'translate-x-full'} duration-300 ease-in-out z-[9999] border-l border-slate-100 flex flex-col`}>
        {/* Header Drawer */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white">
            <div>
                 <h2 className="text-lg font-black">{loading ? "Carregando..." : area?.name}</h2>
                 <p className="text-xs text-slate-400">{area?.city}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
            </button>
        </div>

        {/* Content Drawer Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {loading && <div className="text-center py-10 text-slate-400">Puxando dados operacionais...</div>}
            {error && <div className="text-center py-10 text-red-500 text-sm">Erro: {error}</div>}

            {area && !loading && (
                <>
                {/* 1. Resumo Score */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                     <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Score de Risco</p>
                          <p className="text-2xl font-black text-slate-900">{area.risk_score || 0.0}</p>
                     </div>
                     <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                         area.flood_risk_category === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                     }`}>
                         {area.flood_risk_category || 'MEDIO'}
                     </span>
                </div>

                {/* 2. Descrição */}
                <div>
                     <p className="text-xs font-black text-slate-800 uppercase mb-1">Sobre o local</p>
                     <p className="text-sm text-slate-600 leading-relaxed">{area.description}</p>
                </div>

                {/* 3. Incidentes Recentes */}
                <div>
                     <p className="text-xs font-black text-slate-800 uppercase mb-1">Incidentes Recentes ({area.recent_incidents?.length || 0})</p>
                     {area.recent_incidents?.length === 0 ? (
                         <p className="text-xs text-slate-400">Nenhum incidente em aberto.</p>
                     ) : (
                         <ul className="space-y-2 mt-2">
                             {area.recent_incidents.map((incident: IncidentItem) => (
                                 <li key={incident.id} className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
                                      <p className="text-xs font-bold text-red-800">{incident.title}</p>
                                      <p className="text-[10px] text-red-500">Gravidade: {incident.severity}</p>
                                 </li>
                             ))}
                         </ul>
                     )}
                </div>

                {/* 4. Intervenções em Andamento */}
                <div>
                     <p className="text-xs font-black text-slate-800 uppercase mb-1">Obras/Intervenções ({area.active_interventions?.length || 0})</p>
                     {area.active_interventions?.length === 0 ? (
                         <p className="text-xs text-slate-400">Nenhuma intervenção registrada.</p>
                     ) : (
                         <ul className="space-y-2 mt-2">
                             {area.active_interventions.map((intervention: InterventionItem) => (
                                 <li key={intervention.id} className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                                      <p className="text-xs font-bold text-blue-800">{intervention.title}</p>
                                      <p className="text-[10px] text-blue-600">Status: {intervention.status}</p>
                                      <p className="text-[10px] text-slate-400">{intervention.responsible_agency}</p>
                                 </li>
                             ))}
                         </ul>
                     )}
                </div>
                </>
            )}
        </div>
    </div>
  );
}
