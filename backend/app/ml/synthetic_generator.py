import numpy as np
import pandas as pd
from typing import List, Dict

REGIONS = [
    {"id": "IND_NW", "name": "North-West India (Rajasthan)", "lat": 26.9, "lon": 71.3, "base_temp": 34.0, "base_precip": 5.0, "risk_bias": 0.25},
    {"id": "IND_NC", "name": "Indo-Gangetic Plains (UP/Delhi)", "lat": 27.5, "lon": 79.5, "base_temp": 29.5, "base_precip": 25.0, "risk_bias": 0.40},
    {"id": "IND_NE", "name": "North-East India (Assam/Meghalaya)", "lat": 26.2, "lon": 91.7, "base_temp": 24.0, "base_precip": 95.0, "risk_bias": 0.70},
    {"id": "IND_NH", "name": "Western Himalayas (J&K/HP)", "lat": 32.2, "lon": 76.3, "base_temp": 16.0, "base_precip": 40.0, "risk_bias": 0.65},
    {"id": "IND_CI", "name": "Central India (Madhya Pradesh)", "lat": 23.5, "lon": 77.4, "base_temp": 30.0, "base_precip": 30.0, "risk_bias": 0.35},
    {"id": "IND_WG", "name": "Western Ghats (Kerala/Konkan)", "lat": 10.5, "lon": 76.2, "base_temp": 27.5, "base_precip": 110.0, "risk_bias": 0.75},
    {"id": "IND_TN", "name": "Coromandel Coast (Tamil Nadu)", "lat": 11.1, "lon": 79.3, "base_temp": 31.0, "base_precip": 65.0, "risk_bias": 0.60},
    {"id": "IND_AP", "name": "Eastern Coastal AP (Visakhapatnam)", "lat": 17.7, "lon": 83.2, "base_temp": 30.5, "base_precip": 55.0, "risk_bias": 0.50},
    {"id": "IND_KA", "name": "Deccan Plateau (Karnataka/Telangana)", "lat": 14.5, "lon": 75.8, "base_temp": 28.0, "base_precip": 35.0, "risk_bias": 0.30},
    {"id": "IND_MH", "name": "Maharashtra Interior", "lat": 19.1, "lon": 74.8, "base_temp": 31.5, "base_precip": 20.0, "risk_bias": 0.30},
]

def generate_synthetic_dataset(seed: int = 42) -> pd.DataFrame:
    """Generates synthetic NWP forecast vs verification error data across Days 1-10."""
    np.random.seed(seed)
    rows = []

    for lead_day in range(1, 11):
        # Lead time uncertainty multiplier (increases error potential for higher lead days)
        lead_mult = 1.0 + (lead_day - 1) * 0.18

        for reg in REGIONS:
            # Atmospheric variables with natural synthetic variation across lead days
            day_noise = np.sin(lead_day * 0.5 + reg["lat"]) * 2.0
            temp = reg["base_temp"] + np.random.normal(0, 1.5) + day_noise * 0.5
            precip = max(0.0, reg["base_precip"] + np.random.normal(0, 15.0) * lead_mult)
            humidity = min(100.0, max(20.0, 50.0 + precip * 0.4 + np.random.normal(0, 5.0)))
            pressure = 1013.25 - (temp * 0.4) - (precip * 0.05) + np.random.normal(0, 2.0)
            wind_speed = max(1.0, 5.0 + (precip * 0.08) + np.random.normal(0, 2.5) * lead_mult)
            wind_direction = (180.0 + np.random.normal(0, 45.0)) % 360.0

            # Derived synthetic error & features
            pressure_tendency = np.abs(np.random.normal(0, 1.5)) * lead_mult
            precip_variability = (precip * 0.25) + np.random.normal(0, 5.0) * lead_mult
            hist_error = (reg["risk_bias"] * 30.0) + (lead_day * 4.0) + np.random.normal(0, 5.0)

            # Ground truth bust condition generation
            bust_risk_score = (
                0.25 * (lead_day / 10.0) +
                0.25 * reg["risk_bias"] +
                0.20 * min(1.0, precip_variability / 30.0) +
                0.15 * min(1.0, pressure_tendency / 4.0) +
                0.15 * min(1.0, hist_error / 50.0)
            )
            # Add small random perturbation
            bust_risk_score = float(np.clip(bust_risk_score + np.random.normal(0, 0.05), 0.05, 0.95))
            is_bust = 1 if bust_risk_score > 0.55 else 0

            rows.append({
                "region_id": reg["id"],
                "region_name": reg["name"],
                "lat": reg["lat"],
                "lon": reg["lon"],
                "lead_day": lead_day,
                "temp_2m": round(temp, 1),
                "humidity": round(humidity, 1),
                "pressure": round(pressure, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_direction": round(wind_direction, 1),
                "precipitation": round(precip, 1),
                "pressure_tendency": round(pressure_tendency, 2),
                "precip_variability": round(precip_variability, 2),
                "historical_error": round(hist_error, 1),
                "bust_risk_score": round(bust_risk_score, 3),
                "is_bust": is_bust
            })

    return pd.DataFrame(rows)
