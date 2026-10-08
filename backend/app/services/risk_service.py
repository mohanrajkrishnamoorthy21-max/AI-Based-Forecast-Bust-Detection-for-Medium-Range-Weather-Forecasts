from datetime import datetime
from typing import List, Dict
from app.ml.predictor import predictor_instance
from app.ml.synthetic_generator import REGIONS
from app.config import settings

class RiskService:
    @staticmethod
    def get_dashboard_summary(lead_day: int = 5) -> Dict:
        """Returns overview KPIs for the operational header/dashboard."""
        regions_data = [predictor_instance.predict_region(reg["id"], lead_day) for reg in REGIONS]
        
        bust_probs = [r["bust_probability"] for r in regions_data]
        confidences = [r["confidence_score"] for r in regions_data]
        
        max_bust_prob = float(max(bust_probs)) if bust_probs else 0.0
        low_conf_count = sum(1 for c in confidences if c < 50)
        low_conf_pct = round((low_conf_count / len(confidences)) * 100.0, 1) if confidences else 0.0
        
        # Find highest risk region
        highest_risk = max(regions_data, key=lambda x: x["bust_probability"])

        # Highest risk lead day overall (check across days 1-10)
        day_risks = []
        for d in range(1, 11):
            d_probs = [predictor_instance.predict_region(r["id"], d)["bust_probability"] for r in REGIONS]
            day_risks.append((d, max(d_probs)))
        highest_risk_day = max(day_risks, key=lambda x: x[1])[0]

        return {
            "active_lead_day": lead_day,
            "max_bust_probability": max_bust_prob,
            "low_confidence_area_pct": low_conf_pct,
            "highest_risk_lead_day": highest_risk_day,
            "highest_risk_region": highest_risk["region_name"],
            "model_status": "READY",
            "data_mode": "DEMO / SYNTHETIC DATA",
            "total_regions": len(REGIONS),
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S UTC")
        }

    @staticmethod
    def get_grid_map_data(lead_day: int = 5) -> List[Dict]:
        """Returns spatial grid features and risk scores for all regions in India for a given lead day."""
        return [predictor_instance.predict_region(reg["id"], lead_day) for reg in REGIONS]

    @staticmethod
    def get_region_diagnostic(region_id: str, lead_day: int = 5) -> Dict:
        """Returns detailed meteorological and explainability diagnostics for a single region."""
        return predictor_instance.predict_region(region_id, lead_day)

    @staticmethod
    def get_timeline_data() -> List[Dict]:
        """Returns Day 1 to Day 10 risk and confidence progression."""
        timeline = []
        for day in range(1, 11):
            regions_data = [predictor_instance.predict_region(reg["id"], day) for reg in REGIONS]
            avg_conf = int(round(sum(r["confidence_score"] for r in regions_data) / len(regions_data)))
            max_bust = float(max(r["bust_probability"] for r in regions_data))
            high_risk_count = sum(1 for r in regions_data if r["risk_level"] == "HIGH")

            timeline.append({
                "lead_day": day,
                "avg_confidence": avg_conf,
                "max_bust_probability": max_bust,
                "high_risk_region_count": high_risk_count
            })
        return timeline

    @staticmethod
    def get_data_status() -> Dict:
        """Returns technical data and model status specs."""
        return {
            "data_source": settings.DATA_SOURCE_NAME,
            "is_demo_mode": settings.DEMO_MODE,
            "status_label": "DEMO MODE — SYNTHETIC DATA",
            "model_version": settings.VERSION,
            "model_type": settings.MODEL_TYPE,
            "features_count": 9,
            "regions_count": len(REGIONS),
            "api_health": "Healthy"
        }
