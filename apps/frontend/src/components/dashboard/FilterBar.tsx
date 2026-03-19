'use client';

import { useState } from 'react';

export default function FilterBar() {
  const [period, setPeriod] = useState('7d');
  const [region, setRegion] = useState('all');
  const [risk, setRisk] = useState('all');
  const [layers, setLayers] = useState('heat');

  return (
    <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex flex-wrap items-center gap-4 shadow-sm">
      
      {/* 🗓️ Período */}
      <div className="flex flex-col">
           <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Período</label>
           <select value={period} onChange={e => setPeriod(e.target.value)}
           className="mt-0.5 border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 cursor-pointer">
                <option value="24h">Últimas 24h</option>
                <option value="7d">Últimos 7 dias</option>
                <option value="30d">Mês Atual</option>
           </select>
      </div>

      <div className="h-6 w-px bg-slate-100 hidden md:block"></div>

      {/* 🗺️ Região */}
      <div className="flex flex-col">
           <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Região / Bairro</label>
           <select value={region} onChange={e => setRegion(e.target.value)}
           className="mt-0.5 border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 cursor-pointer">
                <option value="all">Todas as Regiões</option>
                <option value="centro">Centro</option>
                <option value="barra">Barra da Tijuca</option>
                <option value="zona_norte">Zona Norte</option>
           </select>
      </div>

      <div className="h-6 w-px bg-slate-100 hidden md:block"></div>

      {/* ⚠️ Nível de Risco */}
      <div className="flex flex-col">
           <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Nível de Risco</label>
           <select value={risk} onChange={e => setRisk(e.target.value)}
           className="mt-0.5 border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 cursor-pointer">
                <option value="all">Todos</option>
                <option value="high">Apenas Crítico (Alto)</option>
                <option value="medium">Médio / Moderado</option>
           </select>
      </div>

      <div className="h-6 w-px bg-slate-100 hidden md:block"></div>

      {/* 🧬 Camada do Mapa */}
      <div className="flex flex-col">
           <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Camada Visual</label>
           <select value={layers} onChange={e => setLayers(e.target.value)}
           className="mt-0.5 border-0 bg-transparent text-xs font-bold text-slate-800 focus:outline-none focus:ring-0 cursor-pointer">
                <option value="heat">Mapa de Calor (Relatos)</option>
                <option value="risk">Evolução de Risco (Polígonos)</option>
                <option value="climate">Satélite / Clima</option>
           </select>
      </div>

      {/* Botão de Filtrar / Sync (Opcional - mas bom para visual) */}
      <div className="md:ml-auto">
           <button className="bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v.744c0 .54-.384 1.006-.917 1.096A40.118 40.118 0 0112 7.045a40.11 40.11 0 01-8.083-.531A1.096 1.096 0 013 5.418v-.744c0-.54.384-1.006.917-1.096A40.118 40.118 0 0112 3z" />
                </svg>
                Filtrar
           </button>
      </div>
    </div>
  );
}
