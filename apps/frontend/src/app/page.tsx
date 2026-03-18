import dynamic from 'next/dynamic';
import AreaList from '@/components/risk/AreaList';
import { Area } from '@/services/areas';

// Importação dinâmica do mapa (Maplibre) desativando SSR para compatibilidade client-side
const MapContainer = dynamic(
  () => import('@/components/map/MapContainer'),
  { 
    ssr: false, 
    loading: () => <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg flex items-center justify-center text-slate-500">Carregando Mapa...</div> 
  }
);

export default async function Home() {
  // Lê a variável de ambiente DINAMICAMENTE no runtime do contêiner (Server-Side)
  // Isso evita que o Next.js "chumbe" o localhost no pacote JS estático do client-side na build.
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  
  // Garante o sufixo /api/v1 se o usuário não inseriu no Easypanel
  if (apiUrl && !apiUrl.endsWith('/api/v1') && !apiUrl.endsWith('/api/v1/')) {
       apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api/v1` : `${apiUrl}/api/v1`;
  }

  console.log(`[FRONTEND STARTUP LOG]: Buscando dados da API em: ${apiUrl}`);

  let areas: Area[] = [];
  let errorMsg = "";

  try {
     const res = await fetch(`${apiUrl}/areas`, { cache: 'no-store' });
     if (!res.ok) {
         throw new Error(`Erro de resposta da API: ${res.status}`);
     }
     areas = await res.json();
  } catch (e) {
     console.error("[Front Data Load] Dashboard Fetch Error:", e);
     errorMsg = String(e);
  }

  return (
    <div className="flex bg-slate-50 h-screen w-screen overflow-hidden">
      {/* Sidebar dashboard lists */}
      <aside className="w-1/4 h-full p-4 border-r bg-white shadow-sm flex flex-col">
          <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900">Urban Resilience</h1>
              <p className="text-sm text-slate-500">Monitoramento de Riscos</p>
              {errorMsg && <p className="text-xs text-red-400 mt-1">Falha na API: {errorMsg}</p>}
          </div>
          <div className="flex-1 overflow-y-auto">
             <AreaList areas={areas} loading={false} />
          </div>
      </aside>

      {/* Viewport for Map */}
      <main className="flex-1 h-full p-6">
          <MapContainer areas={areas} />
      </main>
    </div>
  );
}
