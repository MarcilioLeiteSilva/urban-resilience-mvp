'use client';

import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  BarChart, Bar, 
  XAxis, YAxis, Tooltip, Legend, 
  CartesianGrid 
} from 'recharts';

export default function AnalyticsRow() {
  // 1. Evolução de Relatos (Dias)
  const dataTrend = [
    { name: 'Seg', relatos: 4, chuva: 10 },
    { name: 'Ter', relatos: 7, chuva: 15 },
    { name: 'Qua', relatos: 3, chuva: 5 },
    { name: 'Qui', relatos: 12, chuva: 35 },
    { name: 'Sex', relatos: 18, chuva: 45 },
    { name: 'Sab', relatos: 9, chuva: 20 },
    { name: 'Dom', relatos: 4, chuva: 10 }
  ];

  // 2. Distribuição por Categoria
  const dataCategory = [
    { name: 'Alagamento', valor: 24 },
    { name: 'Queda Árvore', valor: 12 },
    { name: 'Risco Encosta', valor: 18 },
    { name: 'Lixo/Bueiro', valor: 32 },
    { name: 'Infra', valor: 10 }
  ];

  // 3. Status Operacional (Stacked)
  const dataStatus = [
    { name: 'Centro', resolvidos: 12, abertos: 5 },
    { name: 'Barra', resolvidos: 8, abertos: 3 },
    { name: 'Tijuca', resolvidos: 6, abertos: 4 },
    { name: 'Lapa', resolvidos: 4, abertos: 2 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Evolução de Relatos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col h-64">
           <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Evolução de Relatos vs Chuva</h4>
           <div className="flex-1 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={dataTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                               <linearGradient id="colorRelatos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                               </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Area type="monotone" dataKey="relatos" stroke="#0f172a" fillOpacity={1} fill="url(#colorRelatos)" strokeWidth={2} />
                     </AreaChart>
                </ResponsiveContainer>
           </div>
      </div>

      {/* 2. Distribuição por Categoria */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col h-64">
           <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Ocorrências por Categoria</h4>
           <div className="flex-1 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={dataCategory} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 1" stroke="#f1f5f9" />
                          <XAxis type="number" stroke="#94a3b8" hide />
                          <YAxis dataKey="name" type="category" stroke="#64748b" width={70} />
                          <Tooltip />
                          <Bar dataKey="valor" fill="#e2e8f0" radius={[0, 4, 4, 0]} barSize={12} />
                     </BarChart>
                </ResponsiveContainer>
           </div>
      </div>

      {/* 3. Status Operacional por Região */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col h-64">
           <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-3">Resolução por Região</h4>
           <div className="flex-1 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={dataStatus} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis dataKey="name" stroke="#94a3b8" />
                          <YAxis stroke="#94a3b8" />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Bar dataKey="resolvidos" fill="#059669" stackId="a" barSize={14} radius={[0, 0, 0, 0]} />
                          <Bar dataKey="abertos" fill="#f59e0b" stackId="a" barSize={14} radius={[4, 4, 0, 0]} />
                     </BarChart>
                </ResponsiveContainer>
           </div>
      </div>
    </div>
  );
}
