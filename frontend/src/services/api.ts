import type {
  DashboardSummary,
  GridPoint,
  RegionDiagnostic,
  TimelinePoint,
  DataStatus,
} from '../types/api';

const API_BASE_URL = 'http://localhost:8000/api';

// Fallback synthetic dataset for offline UI dev or server initialization
const MOCK_REGIONS: GridPoint[] = [
  {
    id: 'IND_NW',
    region_name: 'North-West India (Rajasthan)',
    lat: 26.9,
    lon: 71.3,
    lead_day: 5,
    temp_2m: 34.2,
    humidity: 42.0,
    pressure: 1004.5,
    wind_speed: 6.8,
    precipitation: 4.2,
    historical_error: 18.5,
    bust_probability: 0.28,
    confidence_score: 72,
    risk_level: 'LOW',
    top_factors: [
      { feature_name: 'historical_error', display_name: 'Historical Error', contribution: 32.0, description: 'Moderate historical error rate.' },
      { feature_name: 'pressure_tendency', display_name: 'Pressure Tendency', contribution: 28.0, description: 'Stable pressure dynamics.' },
    ],
  },
  {
    id: 'IND_NC',
    region_name: 'Indo-Gangetic Plains (UP/Delhi)',
    lat: 27.5,
    lon: 79.5,
    lead_day: 5,
    temp_2m: 29.8,
    humidity: 68.0,
    pressure: 1008.2,
    wind_speed: 4.5,
    precipitation: 28.0,
    historical_error: 24.0,
    bust_probability: 0.48,
    confidence_score: 52,
    risk_level: 'MODERATE',
    top_factors: [
      { feature_name: 'precipitation', display_name: 'Precipitation Volume', contribution: 38.5, description: 'High convective rainfall.' },
      { feature_name: 'humidity', display_name: 'Relative Humidity', contribution: 24.2, description: 'Elevated moisture levels.' },
    ],
  },
  {
    id: 'IND_NE',
    region_name: 'North-East India (Assam/Meghalaya)',
    lat: 26.2,
    lon: 91.7,
    lead_day: 5,
    temp_2m: 24.5,
    humidity: 88.0,
    pressure: 1002.1,
    wind_speed: 8.2,
    precipitation: 98.4,
    historical_error: 42.1,
    bust_probability: 0.82,
    confidence_score: 18,
    risk_level: 'HIGH',
    top_factors: [
      { feature_name: 'precip_variability', display_name: 'High Rainfall Variability', contribution: 34.5, description: 'Extreme rainfall variance exceeds grid tolerance.' },
      { feature_name: 'pressure_tendency', display_name: 'Rapid Pressure Tendency', contribution: 26.2, description: 'Barometric instability detected.' },
      { feature_name: 'historical_error', display_name: 'Elevated Historical Regional Error', contribution: 21.0, description: 'Region historically prone to NWP grid divergence.' },
      { feature_name: 'wind_speed', display_name: '10m Wind Speed', contribution: 18.3, description: 'Strong localized wind shear.' },
    ],
  },
  {
    id: 'IND_NH',
    region_name: 'Western Himalayas (J&K/HP)',
    lat: 32.2,
    lon: 76.3,
    lead_day: 5,
    temp_2m: 16.4,
    humidity: 74.0,
    pressure: 998.0,
    wind_speed: 9.1,
    precipitation: 45.0,
    historical_error: 38.0,
    bust_probability: 0.74,
    confidence_score: 26,
    risk_level: 'HIGH',
    top_factors: [
      { feature_name: 'historical_error', display_name: 'Elevated Historical Error', contribution: 35.0, description: 'Complex terrain boundary errors.' },
      { feature_name: 'precip_variability', display_name: 'Orographic Precip Variability', contribution: 30.0, description: 'Mountain convective variability.' },
    ],
  },
  {
    id: 'IND_WG',
    region_name: 'Western Ghats (Kerala/Konkan)',
    lat: 10.5,
    lon: 76.2,
    lead_day: 5,
    temp_2m: 27.8,
    humidity: 92.0,
    pressure: 1006.4,
    wind_speed: 11.4,
    precipitation: 112.0,
    historical_error: 44.0,
    bust_probability: 0.86,
    confidence_score: 14,
    risk_level: 'HIGH',
    top_factors: [
      { feature_name: 'precipitation', display_name: 'Monsoon Torrential Rain', contribution: 40.0, description: 'Extreme precipitation rates.' },
      { feature_name: 'wind_speed', display_name: 'Onshore Wind Velocity', contribution: 28.0, description: 'Strong coastal wind bursts.' },
    ],
  },
  {
    id: 'IND_TN',
    region_name: 'Coromandel Coast (Tamil Nadu)',
    lat: 11.1,
    lon: 79.3,
    lead_day: 5,
    temp_2m: 31.2,
    humidity: 78.0,
    pressure: 1007.8,
    wind_speed: 7.2,
    precipitation: 62.0,
    historical_error: 31.0,
    bust_probability: 0.62,
    confidence_score: 38,
    risk_level: 'HIGH',
    top_factors: [
      { feature_name: 'precip_variability', display_name: 'Coastal Rain Variability', contribution: 33.0, description: 'Coastal moisture flux anomalies.' },
    ],
  },
];

export async function fetchDashboardSummary(leadDay: number): Promise<DashboardSummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary?day=${leadDay}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    const maxBust = Math.max(...MOCK_REGIONS.map(r => r.bust_probability));
    return {
      active_lead_day: leadDay,
      max_bust_probability: maxBust,
      low_confidence_area_pct: 30.0,
      highest_risk_lead_day: 6,
      highest_risk_region: 'Western Ghats (Kerala/Konkan)',
      model_status: 'READY',
      data_mode: 'DEMO / SYNTHETIC DATA',
      total_regions: MOCK_REGIONS.length,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    };
  }
}

export async function fetchRiskMapData(leadDay: number): Promise<GridPoint[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/forecast/map?day=${leadDay}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return MOCK_REGIONS.map(r => ({
      ...r,
      lead_day: leadDay,
      bust_probability: Math.min(0.95, Number((r.bust_probability * (1 + (leadDay - 5) * 0.08)).toFixed(2))),
      confidence_score: Math.max(5, Math.min(95, Math.round(r.confidence_score * (1 - (leadDay - 5) * 0.08)))),
      risk_level: r.bust_probability > 0.6 ? 'HIGH' : r.bust_probability > 0.3 ? 'MODERATE' : 'LOW',
    }));
  }
}

export async function fetchTimelineData(): Promise<TimelinePoint[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/forecast/timeline`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return Array.from({ length: 10 }, (_, i) => {
      const day = i + 1;
      const decay = (day - 1) * 6;
      return {
        lead_day: day,
        avg_confidence: Math.max(20, 88 - decay),
        max_bust_probability: Math.min(0.92, 0.35 + (day * 0.05)),
        high_risk_region_count: Math.min(6, Math.floor(1 + day * 0.5)),
      };
    });
  }
}

export async function fetchExplainability(regionId: string, leadDay: number): Promise<RegionDiagnostic> {
  try {
    const res = await fetch(`${API_BASE_URL}/explainability/${regionId}?day=${leadDay}`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    const reg = MOCK_REGIONS.find(r => r.id === regionId) || MOCK_REGIONS[0];
    return {
      region_id: reg.id,
      region_name: reg.region_name,
      lead_day: leadDay,
      bust_probability: reg.bust_probability,
      confidence_score: reg.confidence_score,
      risk_level: reg.risk_level,
      temp_2m: reg.temp_2m,
      humidity: reg.humidity,
      pressure: reg.pressure,
      precipitation: reg.precipitation,
      wind_speed: reg.wind_speed,
      top_factors: reg.top_factors || [],
    };
  }
}

export async function fetchDataStatus(): Promise<DataStatus> {
  try {
    const res = await fetch(`${API_BASE_URL}/data/status`);
    if (!res.ok) throw new Error('API error');
    return await res.json();
  } catch {
    return {
      data_source: 'Synthetic Meteorological Dataset (India Regional Grid)',
      is_demo_mode: true,
      status_label: 'DEMO MODE — SYNTHETIC DATA',
      model_version: 'v0.1.0-DEMO',
      model_type: 'Random Forest Classifier Baseline',
      features_count: 9,
      regions_count: 10,
      api_health: 'Healthy (Demo Mode)',
    };
  }
}
