import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: () => void;
}

export default function ReportModal({ isOpen, onClose, onSubmitSuccess }: ReportModalProps) {
  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [severity, setSeverity] = useState('MEDIUM');
  const [lng, setLng] = useState('-43.1729'); // RJ Default
  const [lat, setLat] = useState('-22.9068'); // RJ Default

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Monta o payload agregando os metadados dentro da Descrição para o backend interpretador
    const payload = {
      description: `[${category} | Risco: ${severity}] ${title}: ${description}`,
      image_url: null,
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      }
    };

    try {
      const res = await fetch(`${apiUrl}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Falha ao enviar relato. Verifique os dados ou tente mais tarde.');
      }

      setSuccess(true);
      setTimeout(() => {
         setSuccess(false);
         onClose();
         if (onSubmitSuccess) onSubmitSuccess();
      }, 2000);

    } catch (err: any) {
      console.error("[Report Form] Submit error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative flex flex-col">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>

        <h3 className="text-xl font-black text-slate-900 mb-1">Relatar Ocorrência</h3>
        <p className="text-xs text-slate-500 mb-4">Contribua para o monitoramento de riscos do seu território.</p>

        {success ? (
            <div className="text-center py-10">
                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-emerald-600">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                 </div>
                 <p className="text-lg font-bold text-slate-900">Relato Enviado!</p>
                 <p className="text-xs text-slate-400">Ele será analisado pela camada operacional.</p>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-3 overflow-y-auto pr-1">
                {error && <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg">{error}</p>}

                <div>
                     <label className="text-[11px] font-black uppercase text-slate-700">Título</label>
                     <input required type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Bueiro entupido na rua tal"
                     className="w-full mt-1 border px-3 py-2 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none" />
                </div>

                <div>
                     <label className="text-[11px] font-black uppercase text-slate-700">Categoria</label>
                     <select required value={category} onChange={e => setCategory(e.target.value)}
                     className="w-full mt-1 border px-3 py-2 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none">
                          <option value="">Selecione...</option>
                          <option value="alagamento">Alagamento/Enchente</option>
                          <option value="desabamento">Risco de Desabamento</option>
                          <option value="obstrucao">Boca de bueiro / Lixo</option>
                          <option value="infra">Dano de Infraestrutura</option>
                     </select>
                </div>

                <div>
                     <label className="text-[11px] font-black uppercase text-slate-700">Gravidade Percebida</label>
                     <select value={severity} onChange={e => setSeverity(e.target.value)}
                     className="w-full mt-1 border px-3 py-2 rounded-lg text-sm bg-slate-50">
                          <option value="LOW">Baixa (Incômodo)</option>
                          <option value="MEDIUM">Média (Atenção)</option>
                          <option value="HIGH">Alta (Risco Iminente)</option>
                     </select>
                </div>

                <div>
                     <label className="text-[11px] font-black uppercase text-slate-700">Descrição</label>
                     <textarea required rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva mais detalhes sobre o que está acontecendo..."
                     className="w-full mt-1 border px-3 py-2 rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                     <div>
                          <label className="text-[11px] font-black uppercase text-slate-700">Longitude</label>
                          <input required type="text" value={lng} onChange={e => setLng(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded-lg text-xs bg-slate-50" />
                     </div>
                     <div>
                          <label className="text-[11px] font-black uppercase text-slate-700">Latitude</label>
                          <input required type="text" value={lat} onChange={e => setLat(e.target.value)} className="w-full mt-1 border px-3 py-2 rounded-lg text-xs bg-slate-50" />
                     </div>
                </div>

                <div className="pt-2">
                     <button type="submit" disabled={loading}
                     className="w-full bg-slate-900 text-white font-bold py-2 rounded-xl text-sm hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2">
                          {loading ? 'Enviando...' : 'Enviar Relato'}
                     </button>
                </div>
            </form>
        )}
      </div>
    </div>
  );
}
