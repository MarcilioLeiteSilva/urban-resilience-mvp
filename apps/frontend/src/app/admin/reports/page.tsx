'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReportItem {
  id: string;
  description: string;
  status: string;
  created_at: string;
  area_id?: string;
  ai_metadata?: {
       ai_category?: string;
       ai_priority_score?: number;
       ai_summary?: string;
  };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    try {
      const res = await fetch(`${apiUrl}/reports?limit=50`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Falha ao buscar relatos.');
      const data = await res.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    try {
      const res = await fetch(`${apiUrl}/reports/${id}/status?status=${newStatus}`, {
        method: 'PATCH',
      });

      if (!res.ok) throw new Error('Falha ao atualizar status.');

      // Atualiza lista localmente sem precisar recarregar
      setReports(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredReports = filter === 'ALL' 
    ? reports 
    : reports.filter(r => r.status === filter);

  return (
    <div className="flex bg-slate-50 h-screen w-screen overflow-hidden">
      {/* Sidebar Admin Simples */}
      <aside className="w-64 h-full p-4 border-r bg-white shadow-sm flex flex-col">
          <div className="mb-6">
              <h1 className="text-xl font-black text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">Gestão Operacional</p>
          </div>
          
          <nav className="space-y-1">
               <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                    Voltar para o Mapa
               </Link>
               <div className="bg-slate-900 text-white flex items-center gap-2 px-3 py-2 text-sm font-bold rounded-lg mt-4">
                    Moderador de Relatos
               </div>
          </nav>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 h-full p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
               <div>
                    <h2 className="text-2xl font-black text-slate-900">Relatos da Comunidade</h2>
                    <p className="text-sm text-slate-500">Modere e valide as ocorrências enviadas pelos moradores.</p>
               </div>

               {/* Filtros Status */}
               <div className="flex bg-white border border-slate-200 rounded-lg p-1 text-xs font-bold text-slate-600">
                    {['ALL', 'RECEIVED', 'VALIDATED', 'REJECTED'].map(status => (
                         <button key={status} onClick={() => setFilter(status)} className={`px-3 py-1.5 rounded-md ${filter === status ? 'bg-slate-900 text-white' : 'hover:bg-slate-50'}`}>
                              {status === 'ALL' ? 'Todos' : status === 'RECEIVED' ? 'Recebidos' : status === 'VALIDATED' ? 'Validados' : 'Rejeitados'}
                         </button>
                    ))}
               </div>
          </div>

          {error && <p className="text-red-500 bg-red-50 p-3 rounded-lg text-sm mb-4">{error}</p>}

          {loading ? (
               <p className="text-slate-400 text-sm animate-pulse">Carregando relatos...</p>
          ) : filteredReports.length === 0 ? (
               <p className="text-slate-500 text-sm">Nenhum relato encontrado nesta categoria.</p>
          ) : (
               <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                         <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 text-xs font-black uppercase">
                                   <th className="p-4">Descrição</th>
                                   <th className="p-4">Classificação IA</th>
                                   <th className="p-4">Data</th>
                                   <th className="p-4">Status</th>
                                   <th className="p-4 text-right">Ações</th>
                              </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100 text-sm">
                              {filteredReports.map((report) => (
                                   <tr key={report.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 max-w-md">
                                             <p className="text-slate-900 font-semibold line-clamp-2">{report.description}</p>
                                             <p className="text-[10px] text-slate-400 mt-0.5">ID: {report.id}</p>
                                        </td>
                                        
                                        <td className="p-4">
                                             {report.ai_metadata?.ai_category ? (
                                                  <div className="space-y-0.5">
                                                       <span className="bg-slate-100 text-slate-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                                                            🤖 {report.ai_metadata.ai_category}
                                                       </span>
                                                       <p className="text-[10px] text-slate-400">Score: {report.ai_metadata.ai_priority_score}</p>
                                                  </div>
                                             ) : (
                                                  <span className="text-slate-300 text-xs">Pendente...</span>
                                             )}
                                        </td>

                                        <td className="p-4 text-xs text-slate-500">
                                             {new Date(report.created_at).toLocaleDateString('pt-BR')}
                                        </td>

                                        <td className="p-4">
                                             <span className={`text-xs px-2 py-0.8 rounded-full font-bold ${
                                                  report.status === 'VALIDATED' ? 'bg-emerald-100 text-emerald-800' :
                                                  report.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                             }`}>
                                                  {report.status}
                                             </span>
                                        </td>

                                        <td className="p-4 text-right">
                                             {report.status === 'RECEIVED' && (
                                                  <div className="flex gap-1 justify-end">
                                                       <button onClick={() => handleUpdateStatus(report.id, 'VALIDATED')} className="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-emerald-700">
                                                            Validar
                                                       </button>
                                                       <button onClick={() => handleUpdateStatus(report.id, 'REJECTED')} className="bg-white border border-slate-200 text-slate-600 text-xs font-bold px-2.5 py-1.5 rounded-lg hover:bg-slate-50">
                                                            Rejeitar
                                                       </button>
                                                  </div>
                                             )}
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>
          )}
      </main>
    </div>
  );
}
