'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import AreaList from '@/components/risk/AreaList';
import AreaDetailDrawer from '@/components/layout/AreaDetailDrawer';
import ReportModal from '@/components/layout/ReportModal';
import { Area } from '@/services/areas';

// Importação dinâmica do mapa (Maplibre) desativando SSR para compatibilidade client-side
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { 
    ssr: false, 
    loading: () => <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg flex items-center justify-center text-slate-500">Carregando Mapa...</div> 
  }
);

interface DashboardViewProps {
  areas: Area[];
  errorMsg: string;
}

export default function DashboardView({ areas, errorMsg }: DashboardViewProps) {
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 h-screen w-screen overflow-hidden">
      {/* Sidebar dashboard lists */}
      <aside className="w-1/4 h-full p-4 border-r bg-white shadow-sm flex flex-col">
          <div className="mb-4">
              <h1 className="text-2xl font-black text-slate-900">Urban Resilience</h1>
              <p className="text-sm text-slate-500">Monitoramento de Riscos</p>
              {errorMsg && <p className="text-xs text-red-400 mt-1">Falha na API: {errorMsg}</p>}

              <button onClick={() => setReportModalOpen(true)} className="w-full mt-3 bg-slate-900 text-white font-bold text-xs py-2 px-3 rounded-lg hover:bg-slate-800 transition flex items-center justify-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Relatar Ocorrência
              </button>
          </div>
          <div className="flex-1 overflow-y-auto">
             <AreaList areas={areas} loading={false} />
          </div>
      </aside>

      {/* Viewport for Map */}
      <main className="flex-1 h-full p-6 relative">
          <MapContainer areas={areas} onAreaClick={(id) => setSelectedAreaId(id)} />
      </main>

      {/* Painel lateral de Detalhes da Área */}
      <AreaDetailDrawer areaId={selectedAreaId} onClose={() => setSelectedAreaId(null)} />

      {/* Modal de Envio de Relato */}
      <ReportModal isOpen={isReportModalOpen} onClose={() => setReportModalOpen(false)} />
    </div>
  );
}
