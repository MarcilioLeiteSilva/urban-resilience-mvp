import dynamic from 'next/dynamic';
import KpiCard from '@/components/dashboard/KpiCard';
import SidebarPanel from '@/components/dashboard/SidebarPanel';

const AnalyticsRow = dynamic(
  () => import('@/components/dashboard/AnalyticsRow'),
  { ssr: false, loading: () => <div className="animate-pulse bg-white h-64 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400">Puxando Gráficos...</div> }
);

export default function DashboardPage() {
  const kpis = [
    { label: 'Áreas Monitoradas', value: 12, delta: { value: 1, type: 'increase', text: 'mês' } },
    { label: 'Áreas Críticas', value: 3, delta: { value: 0, type: 'neutral', text: 'igual' } },
    { label: 'Incidentes Abertos', value: 7, delta: { value: 2, type: 'increase', text: 'hoje' } },
    { label: 'Obras/Intervenções', value: 4, delta: { value: 1, type: 'decrease', text: 'concluído' } },
    { label: 'Relatos da Semana', value: 45, delta: { value: 12, type: 'increase', text: '24h' } },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-2">
                <span className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl">U</span>
                <div>
                     <h1 className="text-base font-black tracking-tight leading-4">Urban Resilience</h1>
                     <p className="text-[10px] text-slate-500">Monitoramento Climático & Infraestrutura</p>
                </div>
           </div>
           
           <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                <button className="text-slate-900 border-b-2 border-slate-900 pb-1">Dashboard</button>
                <button className="hover:text-slate-900 pb-1">Mapa</button>
                <button className="hover:text-slate-900 pb-1">Incidentes</button>
                <button className="hover:text-slate-900 pb-1">Estatísticas</button>
           </nav>

           <div className="flex items-center gap-3">
                <button className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800">
                     + Relatar
                </button>
           </div>
      </header>

      {/* 2. Main Grid Container */}
      <main className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
           
           {/* Row 1: KPI Cards */}
           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {kpis.map((kpi, index) => (
                     <KpiCard key={index} label={kpi.label} value={kpi.value} delta={kpi.delta as any} />
                ))}
           </div>

           {/* Row 2: Map + Sidebar Panel */}
           <div className="grid grid-cols-12 gap-6 h-[500px]">
                {/* Mapa (8 colunas) */}
                <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative">
                     <div className="absolute inset-0 bg-slate-100/50 flex items-center justify-center text-slate-400 text-sm animate-pulse">
                          Carregando Mapa...
                     </div>
                </div>

                {/* Painel Lateral (4 colunas) - INJETADO */}
                <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 overflow-y-auto">
                     <SidebarPanel />
                </div>
           </div>

           {/* Row 3: Analytics Row */}
           <AnalyticsRow />

           {/* Row 4: Bottom Row (Tabelas) */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="h-4 w-40 bg-slate-100 rounded mb-4"></div>
                <div className="space-y-4">
                     {[1, 2, 3].map((item) => (
                          <div key={item} className="h-12 bg-slate-50 rounded-lg animate-pulse"></div>
                     ))}
                </div>
           </div>

      </main>
    </div>
  );
}
