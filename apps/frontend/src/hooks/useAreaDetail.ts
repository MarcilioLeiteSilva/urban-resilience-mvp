import { useState, useEffect } from 'react';
import { AreaDetailed } from '@/types/area';

export function useAreaDetail(areaId: string | null) {
  const [area, setArea] = useState<AreaDetailed | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!areaId) {
      setArea(null);
      return;
    }

    setLoading(true);
    setError(null);

    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Garante compatibilidade de sufixo /api/v1 se o usuário omitiu
    if (apiUrl && !apiUrl.endsWith('/api/v1') && !apiUrl.endsWith('/api/v1/')) {
        apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api/v1` : `${apiUrl}/api/v1`;
    }

    fetch(`${apiUrl}/areas/${areaId}`)
      .then(async res => {
        if (!res.ok) throw new Error('Falha ao carregar detalhe da área.');
        const data = await res.json();
        setArea(data);
      })
      .catch(err => {
        console.error("[AreaDetail Hook] Error:", err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [areaId]);

  return { area, loading, error };
}
