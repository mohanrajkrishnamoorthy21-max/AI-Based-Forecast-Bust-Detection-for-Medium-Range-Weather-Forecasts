import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List, Tuple

from app.ml.synthetic_generator import generate_synthetic_dataset
from app.ml.feature_engineering import extract_features, FEATURE_COLUMNS, FEATURE_DISPLAY_NAMES, FEATURE_DESCRIPTIONS

class BustPredictor:
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
        self.is_trained = False
        self.dataset_df: pd.DataFrame = pd.DataFrame()
        self.feature_importances_: Dict[str, float] = {}

    def train(self):
        """Train baseline Random Forest model on generated synthetic NWP verification dataset."""
        df = generate_synthetic_dataset(seed=42)
        self.dataset_df = df
        X = extract_features(df)
        y = df["is_bust"]

        self.model.fit(X, y)
        self.is_trained = True

        importances = self.model.feature_importances_
        for col, imp in zip(FEATURE_COLUMNS, importances):
            self.feature_importances_[col] = float(imp)

    def predict_region(self, region_id: str, lead_day: int) -> Dict:
        """Predicts forecast bust probability, confidence score, and explanation factors for a region & lead day."""
        if not self.is_trained:
            self.train()

        # Find matching row in synthetic dataset
        subset = self.dataset_df[
            (self.dataset_df["region_id"] == region_id) & 
            (self.dataset_df["lead_day"] == lead_day)
        ]

        if subset.empty:
            # Fallback row if exact match missing
            row = self.dataset_df[self.dataset_df["lead_day"] == lead_day].iloc[0].to_dict()
        else:
            row = subset.iloc[0].to_dict()

        # Prepare single sample
        sample_df = pd.DataFrame([row])
        X_sample = extract_features(sample_df)

        # Class probabilities: [P(No-Bust), P(Bust)]
        probs = self.model.predict_proba(X_sample)[0]
        bust_prob = float(probs[1]) if len(probs) > 1 else float(row["bust_risk_score"])
        
        # Calculate Confidence Score (Inverse of bust risk & lead decay)
        raw_confidence = 100.0 * (1.0 - bust_prob)
        confidence_score = int(np.clip(round(raw_confidence), 0, 100))

        # Risk Level Category
        if bust_prob >= 0.61:
            risk_level = "HIGH"
        elif bust_prob >= 0.31:
            risk_level = "MODERATE"
        else:
            risk_level = "LOW"

        # Compute top contributing feature factors for explainability
        top_factors = self._compute_feature_contributions(X_sample.iloc[0], bust_prob)

        return {
            "region_id": row["region_id"],
            "region_name": row["region_name"],
            "lat": float(row["lat"]),
            "lon": float(row["lon"]),
            "lead_day": int(lead_day),
            "temp_2m": float(row["temp_2m"]),
            "humidity": float(row["humidity"]),
            "pressure": float(row["pressure"]),
            "precipitation": float(row["precipitation"]),
            "wind_speed": float(row["wind_speed"]),
            "historical_error": float(row["historical_error"]),
            "bust_probability": round(bust_prob, 2),
            "confidence_score": confidence_score,
            "risk_level": risk_level,
            "top_factors": top_factors
        }

    def _compute_feature_contributions(self, sample_series: pd.Series, bust_prob: float) -> List[Dict]:
        """Calculates deterministic contribution weights for explainability panel."""
        factors = []
        raw_scores = {}

        # Heuristic attribution based on feature values relative to risk thresholds * model global importance
        for col in FEATURE_COLUMNS:
            val = float(sample_series[col])
            imp = self.feature_importances_.get(col, 0.1)

            if col == "lead_day":
                score = (val / 10.0) * imp
            elif col == "pressure_tendency":
                score = (val / 4.0) * imp * 1.2
            elif col == "precip_variability":
                score = (val / 30.0) * imp * 1.3
            elif col == "historical_error":
                score = (val / 50.0) * imp * 1.1
            elif col == "precipitation":
                score = (val / 100.0) * imp
            elif col == "wind_speed":
                score = (val / 20.0) * imp
            else:
                score = imp * 0.5

            raw_scores[col] = float(score)

        total_score = sum(raw_scores.values()) or 1.0
        
        # Sort factors descending by contribution
        sorted_cols = sorted(raw_scores.keys(), key=lambda k: raw_scores[k], reverse=True)

        for col in sorted_cols[:4]:  # Top 4 factors
            contrib_pct = round((raw_scores[col] / total_score) * 100.0, 1)
            factors.append({
                "feature_name": col,
                "display_name": FEATURE_DISPLAY_NAMES.get(col, col),
                "contribution": contrib_pct,
                "description": FEATURE_DESCRIPTIONS.get(col, "Atmospheric contribution to forecast risk.")
            })

        return factors

predictor_instance = BustPredictor()
