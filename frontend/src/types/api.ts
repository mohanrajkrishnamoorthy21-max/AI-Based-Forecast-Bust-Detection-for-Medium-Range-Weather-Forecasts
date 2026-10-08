export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH';

export interface ExplanationFactor {
  feature_name: string;
  display_name: string;
  contribution: number; // percentage
  description: string;
}

export interface GridPoint {
  id: string;
  region_name: string;
  lat: number;
  lon: number;
  lead_day: number;
  temp_2m: number;
  humidity: number;
  pressure: number;
  wind_speed: number;
  precipitation: number;
  historical_error: number;
  bust_probability: number; // 0.0 to 1.0
  confidence_score: number; // 0 to 100
  risk_level: RiskLevel;
  top_factors?: ExplanationFactor[];
}

export interface RegionDiagnostic {
  region_id: string;
  region_name: string;
  lead_day: number;
  bust_probability: number;
  confidence_score: number;
  risk_level: RiskLevel;
  temp_2m: number;
  humidity: number;
  pressure: number;
  precipitation: number;
  wind_speed: number;
  top_factors: ExplanationFactor[];
}

export interface TimelinePoint {
  lead_day: number;
  avg_confidence: number;
  max_bust_probability: number;
  high_risk_region_count: number;
}

export interface DashboardSummary {
  active_lead_day: number;
  max_bust_probability: number;
  low_confidence_area_pct: number;
  highest_risk_lead_day: number;
  highest_risk_region: string;
  model_status: string;
  data_mode: string;
  total_regions: number;
  timestamp: string;
}

export interface DataStatus {
  data_source: string;
  is_demo_mode: boolean;
  status_label: string;
  model_version: string;
  model_type: string;
  features_count: number;
  regions_count: number;
  api_health: string;
}
