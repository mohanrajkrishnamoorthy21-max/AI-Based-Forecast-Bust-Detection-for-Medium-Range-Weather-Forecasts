from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class GridPoint(BaseModel):
    id: str
    region_name: str
    lat: float
    lon: float
    lead_day: int
    temp_2m: float  # Celsius
    humidity: float  # %
    pressure: float  # hPa
    wind_speed: float  # m/s
    wind_direction: float  # degrees
    precipitation: float  # mm
    historical_error: float  # mm/degree error proxy
    bust_probability: float  # 0.0 to 1.0
    confidence_score: int  # 0 to 100
    risk_level: str  # LOW, MODERATE, HIGH

class ExplanationFactor(BaseModel):
    feature_name: str
    display_name: str
    contribution: float  # percentage e.g. 31.5
    description: str

class RegionDiagnostic(BaseModel):
    region_id: str
    region_name: str
    lead_day: int
    bust_probability: float
    confidence_score: int
    risk_level: str
    temp_2m: float
    humidity: float
    pressure: float
    precipitation: float
    wind_speed: float
    top_factors: List[ExplanationFactor]

class TimelinePoint(BaseModel):
    lead_day: int
    avg_confidence: int
    max_bust_probability: float
    high_risk_region_count: int

class DashboardSummary(BaseModel):
    active_lead_day: int
    max_bust_probability: float
    low_confidence_area_pct: float
    highest_risk_lead_day: int
    highest_risk_region: str
    model_status: str
    data_mode: str
    total_regions: int
    timestamp: str

class DataStatus(BaseModel):
    data_source: str
    is_demo_mode: bool
    status_label: str
    model_version: str
    model_type: str
    features_count: int
    regions_count: int
    api_health: str
