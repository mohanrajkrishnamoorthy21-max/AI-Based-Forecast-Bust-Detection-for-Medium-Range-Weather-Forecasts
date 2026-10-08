# AI-Based Forecast Bust Detection for Medium-Range Weather Forecasts (SIH 26079)

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0%2B-3178C6.svg)
![Vite](https://img.shields.io/badge/Vite-6.0%2B-646CFF.svg)

> **SIH Problem Statement 26079**: An end-to-end Machine Learning solution for early warning and spatial-temporal detection of **Forecast Busts** in medium-range weather predictions (Days 1–10).

---

## 📌 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Endpoints](#-api-endpoints)
- [ML Pipeline & Methodology](#-ml-pipeline--methodology)
- [License](#-license)

---

## 🌤️ Overview

Medium-range weather forecasts (3 to 10 days) frequently experience **Forecast Busts**—sudden severe degradation in model prediction accuracy due to chaotic atmospheric dynamics, ensemble divergence, or localized convection instabilities.

This system combines **Machine Learning ensemble classification**, **meteorological feature engineering** (CAPE, baroclinic instability, vertical wind shear, spatial gradients), and an **interactive diagnostic dashboard** to:
1. Identify high-risk forecast bust regions across India up to 10 days in advance.
2. Provide meteorological feature attribution (explainability) for predicted busts.
3. Track model reliability and dataset status across satellite, radar, radiosonde, and NWP model feeds.

---

## ✨ Key Features

- **🌐 Interactive Geospatial Risk Map**: High-performance Leaflet-based map displaying real-time risk heatmaps across grid points for Lead Days 1 to 10.
- **📊 Real-Time KPI Dashboard**: Metrics tracking High-Risk Regions, Mean Model Confidence, Active Weather Systems Monitored, and High-Risk Grid Point Counts.
- **🔍 Explainable AI (XAI) Diagnostics**: Region-level breakdown of bust drivers (e.g., Ensemble Spread, CAPE, Baroclinic Instability, Vertical Shear).
- **📈 Reliability & Timeline Analysis**: Interactive Recharts visualization comparing observed vs. predicted bust probabilities across 10-day forecast horizons.
- **📡 Data Source & Model Status Monitoring**: Live health and latency tracking for NWP models, Radar feeds, Satellite imagery, and Radiosonde networks.

---

## 🏗️ System Architecture

```
                       +-----------------------------+
                       |   React + TypeScript Frontend|
                       |  (Vite, Tailwind, Leaflet)  |
                       +--------------+--------------+
                                      |
                                  REST APIs
                                      |
                       +--------------v--------------+
                       |    FastAPI Python Backend   |
                       +--------------+--------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
+--------v--------+                                       +--------v--------+
| Feature Engine  |                                       | ML Risk Engine  |
| (CAPE, Shear,   |                                       | (Random Forest /|
| Spread, Skew)   |                                       | Gradient Boost) |
+-----------------+                                       +-----------------+
```

---

## 📁 Project Structure

```
SIH26079/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes_forecast.py   # REST API routes & endpoints
│   │   ├── ml/
│   │   │   ├── feature_engineering.py # Meteorological feature computation
│   │   │   ├── predictor.py          # ML Model training & inference pipeline
│   │   │   └── synthetic_generator.py # Synthetic meteorological ensemble generator
│   │   ├── schemas/
│   │   │   └── forecast.py           # Pydantic data schemas
│   │   ├── services/
│   │   │   └── risk_service.py       # Core risk computation & aggregation
│   │   ├── config.py                 # Backend application configuration
│   │   └── main.py                   # FastAPI entrypoint
│   └── requirements.txt              # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── dashboard/            # KPI cards, Risk Map, Explainability, Charts
│   │   │   └── layout/               # Header, Navigation bar
│   │   ├── services/                 # Axios API services
│   │   ├── types/                    # TypeScript interfaces
│   │   ├── App.tsx                   # Main React App layout
│   │   └── main.tsx                  # React entry point
│   ├── package.json                  # Frontend dependencies & scripts
│   └── vite.config.ts                # Vite build configuration
├── skills.md                         # Project skill documentation
└── README.md                         # Project documentation
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Machine Learning**: [Scikit-Learn](https://scikit-learn.org/), [Joblib](https://joblib.readthedocs.io/)
- **Data Processing**: [NumPy](https://numpy.org/), [Pandas](https://pandas.pydata.org/)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)

### Frontend
- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Maps**: [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

### Prerequisites
- **Python**: `3.10` or higher
- **Node.js**: `18.0` or higher (npm `9.0`+)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment (optional but recommended):
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the FastAPI backend server:
   ```bash
   python -m app.main
   ```
   The backend API will run at `http://127.0.0.1:8000`. You can explore the interactive API docs at `http://127.0.0.1:8000/docs`.

---

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Service health check |
| `GET` | `/api/v1/dashboard/summary?day={1-10}` | Global KPIs & summary stats for specified lead day |
| `GET` | `/api/v1/forecast/map?day={1-10}` | Spatial grid points with risk probabilities & confidence |
| `GET` | `/api/v1/forecast/timeline` | 10-day historical/forecast risk trend & reliability metrics |
| `GET` | `/api/v1/explainability/{region_id}?day={1-10}` | Detailed feature importance & diagnostics for a region |
| `GET` | `/api/v1/data/status` | Real-time operational status of underlying data streams |

---

## 🧠 ML Pipeline & Methodology

1. **Synthetic & Operational Ensemble Simulation**: Generates multi-member ensemble forecasts across key atmospheric variables (Temperature, Geopotential Height, Wind Components, Specific Humidity).
2. **Feature Engineering**:
   - **Ensemble Spread & Skewness**: Variance across model members.
   - **Atmospheric Instability**: CAPE (Convective Available Potential Energy), Baroclinic Instability Index.
   - **Dynamical Shear**: Vertical wind shear & spatial gradient magnitude.
3. **Risk Classification**: A trained Classifier estimates the probability of a forecast bust ($P(\text{Bust}) > 0.65$) along with model prediction confidence intervals.
4. **Explainability Engine**: Extracts feature importance rankings per region to pinpoint whether a bust risk is driven by ensemble divergence, convective dynamics, or baroclinic instability.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details. Developed for Smart India Hackathon (SIH 26079).
