const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface Area {
    id: string;
    name: string;
    description: string | null;
    risk_score: number;
    flood_risk_category: string;
}

export async function fetchAreas(): Promise<Area[]> {
    try {
        const res = await fetch(`${API_URL}/areas`, { cache: 'no-store' });
        if (!res.ok) {
            throw new Error(`Failed to fetch areas: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
         console.error("API Fetch Error:", error);
         return [];
    }
}
