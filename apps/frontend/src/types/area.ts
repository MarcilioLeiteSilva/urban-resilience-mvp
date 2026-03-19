export interface IncidentItem {
  id: string;
  title: string;
  type: string;
  severity: string;
  created_at: string;
}

export interface InterventionItem {
  id: string;
  title: string;
  status: string;
  responsible_agency: string;
}

export interface AreaDetailed {
  id: string;
  name: string;
  city: string;
  description: string;
  flood_risk_category: string;
  risk_score: number;
  recent_incidents: IncidentItem[];
  active_interventions: InterventionItem[];
  latest_risk_score?: {
    score: number;
    description: string;
  };
}
