'use client';

import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { fetchAreas, Area } from '@/services/areas';

export default function AreaList() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     async function load() {
         const data = await fetchAreas();
         setAreas(data);
         setLoading(false);
     }
     load();
  }, []);

  // Dados mockados de fallback para o mapa se a API estiver limpa/vazia
  const placeholders = [
    { id: '1', name: 'Centro (Exemplo)', risk_score: 0.82, flood_risk_category: 'HIGH' },
    { id: '2', name: 'Copacabana (Exemplo)', risk_score: 0.45, flood_risk_category: 'MEDIUM' },
  ];

  const currentList = areas.length > 0 ? areas : placeholders as unknown as Area[];

  if (loading) {
      return (
          <div className="bg-white rounded-lg shadow-md p-4 h-full border flex items-center justify-center">
              <p className="text-sm text-slate-400">Buscando áreas no backend...</p>
          </div>
      );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full border">
      <h2 className="text-xl font-bold mb-1 text-slate-800">Áreas</h2>
      <p className="text-xs text-slate-400 mb-4">
          {areas.length > 0 ? '🟢 Conectado à API' : '⚪ Usando dados Locais (Vazio no DB)'}
      </p>
      
      <ul className="space-y-3">
        {currentList.map((area) => (
          <li key={area.id} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer flex justify-between items-center transition">
            <div>
              <span className="font-medium text-slate-800">{area.name}</span>
              <p className="text-sm text-slate-500">Score de Risco: {area.risk_score.toFixed(2)}</p>
            </div>
            {area.flood_risk_category === 'HIGH' && (
              <div className="flex items-center text-red-500 text-xs font-semibold gap-1">
                <AlertCircle className="h-4 w-4" />
                Alto
              </div>
            )}
            {area.flood_risk_category === 'MEDIUM' && (
              <div className="flex items-center text-amber-500 text-xs font-semibold gap-1">
                 Médio
              </div>
            )}
             {area.flood_risk_category === 'LOW' && (
              <div className="flex items-center text-green-500 text-xs font-semibold gap-1">
                 Baixo
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
