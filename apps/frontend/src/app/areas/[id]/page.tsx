import AppLayout from '@/components/layout/AppLayout';

interface AreaPageProps {
  params: { id: string };
}

export default function AreaDetailPage({ params }: AreaPageProps) {
  return (
    <AppLayout>
      {/* 1. Header Título */}
      <div>
           <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">Área Crítica</span>
           <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">Detalhamento da Área [ID {params.id}]</h2>
           <p className="text-xs text-slate-500">Histórico operacional, risco geotécnico e balanço de investimentos.</p>
      </div>

      {/* 2. Grid Element Dummy View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-center h-96 text-slate-400">
           <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-semibold">Página de Área em Manutenção Visual</p>
           </div>
      </div>
    </AppLayout>
  );
}
