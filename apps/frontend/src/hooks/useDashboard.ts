import { useState, useEffect } from 'react';

export interface DashboardSummary {
  total_areas: number;
  critical_areas: number;
  recent_reports_count: number;
  open_incidents_count: number;
  ongoing_interventions_count: number;
}

export interface CriticalArea {
  id: string;
  name: string;
  risk_score: number;
  flood_risk_category: string;
}

export interface RecentReport {
  id: string;
  description: string;
  status: string;
  created_at: string;
}

export function useDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [criticalAreas, setCriticalAreas] = useState<CriticalArea[]>([]);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    let apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    // Garante compatibilidade de sufixo /api/v1 se o usuário omitiu
    if (apiUrl && !apiUrl.endsWith('/api/v1') && !apiUrl.endsWith('/api/v1/')) {
        apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api/v1` : `${apiUrl}/api/v1`;
    }

    try {
      // Executa as chamadas em paralelo
      const [summaryRes, areasRes, reportsRes] = await Promise.all([
        fetch(`${apiUrl}/dashboard/summary`, { cache: 'no-store' }),
        fetch(`${apiUrl}/dashboard/critical-areas?limit=5`, { cache: 'no-store' }),
        fetch(`${apiUrl}/dashboard/recent-reports?limit=5`, { cache: 'no-store' })
      ]);

      if (!summaryRes.ok || !areasRes.ok || !reportsRes.ok) {
        throw new Error('Falha ao obter dados do dashboard.');
      }

      setSummary(await summaryRes.json());
      setCriticalAreas(await areasRes.json());
      setRecentReports(await reportsRes.json());

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { summary, criticalAreas, recentReports, loading, error, refetch: fetchDashboard };
}
