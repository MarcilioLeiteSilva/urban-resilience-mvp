import DashboardView from '@/components/layout/DashboardView';
import { Area } from '@/services/areas';

export default async function Home() {
  // Lê a variável de ambiente DINAMICAMENTE no runtime do contêiner (Server-Side)
  // Isso evita que o Next.js "chumbe" o localhost no pacote JS estático do client-side na build.
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  
  // Garante o sufixo /api/v1 se o usuário não inseriu no Easypanel
  if (apiUrl && !apiUrl.endsWith('/api/v1') && !apiUrl.endsWith('/api/v1/')) {
       apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api/v1` : `${apiUrl}/api/v1`;
  }

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

  // Repassa os dados para o Client Component DashboardView
  return <DashboardView areas={areas} errorMsg={errorMsg} />;
}
