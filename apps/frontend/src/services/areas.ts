const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/api/v1');

export interface Area {
    id: string;
    name: string;
    city: string;
    description: string | null;
    risk_score: number | null;
    flood_risk_category: string;
    geometry: any; // GeoJSON geometry (Polygon / MultiPolygon)
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
