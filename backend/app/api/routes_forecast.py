from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict

from app.schemas.forecast import (
    GridPoint, DashboardSummary, RegionDiagnostic, TimelinePoint, DataStatus
)
from app.services.risk_service import RiskService

router = APIRouter()

@router.get("/health")
def get_health():
    return {"status": "ok", "service": "SIH 26079 Forecast Bust Detection API"}

@router.get("/dashboard/summary", response_model=DashboardSummary)
def get_dashboard_summary(day: int = Query(default=5, ge=1, le=10)):
    return RiskService.get_dashboard_summary(lead_day=day)

@router.get("/forecast/map", response_model=List[GridPoint])
def get_risk_map(day: int = Query(default=5, ge=1, le=10)):
    return RiskService.get_grid_map_data(lead_day=day)

@router.get("/forecast/timeline", response_model=List[TimelinePoint])
def get_timeline():
    return RiskService.get_timeline_data()

@router.get("/explainability/{region_id}", response_model=RegionDiagnostic)
def get_explainability(region_id: str, day: int = Query(default=5, ge=1, le=10)):
    try:
        return RiskService.get_region_diagnostic(region_id=region_id, lead_day=day)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Region {region_id} not found: {str(e)}")

@router.get("/data/status", response_model=DataStatus)
def get_data_status():
    return RiskService.get_data_status()
