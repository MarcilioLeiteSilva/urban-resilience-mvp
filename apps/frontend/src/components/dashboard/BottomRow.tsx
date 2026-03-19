export default function BottomRow() {
  const recentReports = [
    { id: '0034', desc: 'Acúmulo de lixo na boca de bueiro provocando transbordamento', area: 'Centro', status: 'RECEIVED', time: '10m' },
    { id: '0033', desc: 'Rachadura em muro de contenção na encosta norte', area: 'Tijuca', status: 'VALIDATED', time: '45m' },
    { id: '0032', desc: 'Pista escorregadia por óleo derramado após chuva', area: 'Lapa', status: 'RECEIVED', time: '1h' },
    { id: '0031', desc: 'Queda de galho de grande porte obstruindo calçada', area: 'Barra', status: 'VALIDATED', time: '3h' }
  ];

  const rankingAreas = [
    { name: 'Centro', score: 85, trend: 'up' },
    { name: 'Barra', score: 72, trend: 'down' },
    { name: 'Tijuca', score: 68, trend: 'up' }
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* 1. Tabela de Relatos Recentes (8 Colunas) */}
      <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col">
           <div className="flex items-center justify-between mb-4">
                <div>
                     <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Relatos Recentes</h4>
                     <p className="text-[10px] text-slate-400 mt-0.5">Chamados submetidos pela rede de moradores.</p>
                </div>
                <button className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1">
                     Ver todos
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                     </svg>
                </button>
           </div>

           <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                     <thead>
                          <tr className="border-b border-slate-100 text-[10px] uppercase font-black text-slate-400">
                               <th className="py-2 px-3">Descrição</th>
                               <th className="py-2 px-3">Área</th>
                               <th className="py-2 px-3">Status</th>
                               <th className="py-2 px-3 text-right">Tempo</th>
                          </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-xs">
                          {recentReports.map((report) => (
                               <tr key={report.id} className="hover:bg-slate-50 transition">
                                    <td className="py-3 px-3 font-semibold text-slate-800 max-w-xs truncate">{report.desc}</td>
                                    <td className="py-3 px-3 text-slate-500">{report.area}</td>
                                    <td className="py-3 px-3">
                                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                              report.status === 'VALIDATED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                         }`}>
                                              {report.status}
                                         </span>
                                    </td>
                                    <td className="py-3 px-3 text-right text-slate-400">{report.time}</td>
                               </tr>
                          ))}
                     </tbody>
                </table>
           </div>
      </div>

      {/* 2. Painel de Ações e Ranking (4 Colunas) */}
      <div className="col-span-12 lg:col-span-4 space-y-4">
           {/* Ranking de Áreas */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Ranking de Gravidade</h4>
                <div className="space-y-2 flex-1">
                     {rankingAreas.map((area, index) => (
                          <div key={area.name} className="flex items-center justify-between text-xs">
                               <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-400 w-4">#0{index + 1}</span>
                                    <span className="font-semibold text-slate-800">{area.name}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                         <div className="h-full bg-slate-900 rounded-full" style={{ width: `${area.score}%` }}></div>
                                    </div>
                                    <span className="font-bold text-slate-600 text-[10px]">{area.score}%</span>
                               </div>
                          </div>
                     ))}
                </div>
           </div>

           {/* Ações Rápidas */}
           <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-2">Ações Rápidas</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                     <button className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-700">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                          </svg>
                          <span className="font-bold text-[10px] text-slate-800">Alertar Defesa</span>
                     </button>
                     <button className="flex flex-col items-center justify-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-700">
                               <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                          <span className="font-bold text-[10px] text-slate-800">Pdf Relatório</span>
                     </button>
                </div>
           </div>
      </div>
    </div>
  );
}
