import DashboardView from '@/components/layout/DashboardView';
import { Area } from '@/services/areas';

// Ignora bloqueios de certificado self-signed em ambiente Node (Easypanel temporário)
if (typeof window === 'undefined') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export default async function Home() {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
       if (process.env.NODE_ENV === 'production') {
            throw new Error("Variavel de ambiente NEXT_PUBLIC_API_URL nao configurada em Producao!");
       }
       // Fallback seguro apenas para local dev
       apiUrl = 'http://localhost:8000/api/v1';
  }
  
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
