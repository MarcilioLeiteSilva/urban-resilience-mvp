import AppLayout from '@/components/layout/AppLayout';

export default function NewReportPage() {
  return (
    <AppLayout>
      {/* 1. Header Título */}
      <div>
           <h2 className="text-xl font-black text-slate-900 tracking-tight">Novo Relato</h2>
           <p className="text-xs text-slate-500">Contribua informando riscos ou ocorrências na sua rua.</p>
      </div>

      {/* 2. Grid Element Dummy View */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-center h-96 text-slate-400">
           <div className="flex flex-col items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-slate-300">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-semibold">Formulário em Manutenção Visual</p>
           </div>
      </div>
    </AppLayout>
  );
}
