import { AlertCircle } from 'lucide-react';

export default function AreaList() {
  const areas = [
    { id: '1', name: 'Centro', risk: 0.82, category: 'HIGH' },
    { id: '2', name: 'Copacabana', risk: 0.45, category: 'MEDIUM' },
    { id: '3', name: 'Tijuca', risk: 0.15, category: 'LOW' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full border">
      <h2 className="text-xl font-bold mb-4 text-slate-800">Bairros Monitorados</h2>
      <ul className="space-y-3">
        {areas.map((area) => (
          <li key={area.id} className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer flex justify-between items-center transition">
            <div>
              <span className="font-medium text-slate-800">{area.name}</span>
              <p className="text-sm text-slate-500">Score de Risco: {area.risk.toFixed(2)}</p>
            </div>
            {area.category === 'HIGH' && (
              <div className="flex items-center text-red-500 text-xs font-semibold gap-1">
                <AlertCircle className="h-4 w-4" />
                Alto RISCO
              </div>
            )}
            {area.category === 'MEDIUM' && (
              <div className="flex items-center text-amber-500 text-xs font-semibold gap-1">
                 Médio
              </div>
            )}
             {area.category === 'LOW' && (
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
