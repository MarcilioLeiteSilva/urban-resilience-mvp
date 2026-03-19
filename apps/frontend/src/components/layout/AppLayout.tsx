import Link from 'next/link';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Shared Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm">
           <Link href="/dashboard" className="flex items-center gap-2">
                <span className="h-8 w-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xl">U</span>
                <div>
                     <h1 className="text-base font-black tracking-tight leading-4">Urban Resilience</h1>
                     <p className="text-[10px] text-slate-500">Monitoramento Climático</p>
                </div>
           </Link>
           
           <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
                <Link href="/dashboard" className="hover:text-slate-900 pb-1">Dashboard</Link>
                <Link href="/reports" className="hover:text-slate-900 pb-1">Relatos</Link>
                <Link href="/incidents" className="hover:text-slate-900 pb-1">Incidentes</Link>
                <Link href="/interventions" className="hover:text-slate-900 pb-1">Intervenções</Link>
           </nav>

           <div className="flex items-center gap-3">
                <Link href="/reports/new" className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-800 shadow-sm">
                     + Novo Relato
                </Link>
                <Link href="/admin/dashboard" className="text-xs font-black text-slate-700 bg-slate-100 px-2.5 py-1.5 rounded-lg hover:bg-slate-200">
                     Admin
                </Link>
           </div>
      </header>

      {/* 2. Conteúdo da Sub-Página */}
      <main className="flex-1 p-6 space-y-4 max-w-7xl mx-auto w-full">
           {children}
      </main>
    </div>
  );
}
