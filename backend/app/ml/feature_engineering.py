import numpy as np
import pandas as pd
from typing import Tuple, List

FEATURE_COLUMNS = [
    "lead_day",
    "temp_2m",
    "humidity",
    "pressure",
    "wind_speed",
    "precipitation",
    "pressure_tendency",
    "precip_variability",
    "historical_error"
]

FEATURE_DISPLAY_NAMES = {
    "lead_day": "Lead Time Decay",
    "temp_2m": "Surface Temperature",
    "humidity": "Relative Humidity",
    "pressure": "Surface Pressure",
    "wind_speed": "10m Wind Speed",
    "precipitation": "Precipitation Volume",
    "pressure_tendency": "Rapid Pressure Tendency",
    "precip_variability": "High Rainfall Variability",
    "historical_error": "Elevated Historical Regional Error"
}

FEATURE_DESCRIPTIONS = {
    "lead_day": "Forecast error compounds as lead time increases towards Day 10.",
    "temp_2m": "Temperature extremes increase atmospheric convection uncertainty.",
    "humidity": "High moisture levels coupled with pressure drops indicate instability.",
    "pressure": "Localized pressure anomalies destabilize NWP model trajectories.",
    "wind_speed": "High wind velocity correlates with shear and advection forecast errors.",
    "precipitation": "Convective rainfall is notoriously difficult for NWP grid parameterization.",
    "pressure_tendency": "Sharp barometric changes signal incoming fronts not fully resolved by NWP.",
    "precip_variability": "Spatial-temporal rainfall fluctuations exceed grid cell tolerance.",
    "historical_error": "Region has a documented history of NWP model divergence under similar setups."
}

def extract_features(df: pd.DataFrame) -> pd.DataFrame:
    """Ensures feature set is clean and formatted for ML pipeline."""
    X = df[FEATURE_COLUMNS].copy()
    # Normalize features if necessary or fill missing values
    X = X.fillna(X.median())
    return X
