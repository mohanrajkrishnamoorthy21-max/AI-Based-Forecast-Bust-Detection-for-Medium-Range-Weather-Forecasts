import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "SIH 26079 — Forecast Bust Detection Intelligence"
    VERSION: str = "0.1.0-DEMO"
    DEMO_MODE: bool = True
    DATA_SOURCE_NAME: str = "Synthetic Meteorological Dataset (India Regional Grid)"
    MODEL_TYPE: str = "Random Forest Classifier Baseline"
    API_PREFIX: str = "/api"

settings = Settings()
