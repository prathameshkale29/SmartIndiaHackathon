from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from advisory_engine import crop_planning, weather_alert, pest_risk

\1
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CropPlanningRequest(BaseModel):
    crop: str
    location: str
    sowing_date: str  # YYYY-MM-DD
    soil_type: str
    ndvi_trend: str = "stable"  # increasing / decreasing / stable


class WeatherAlertRequest(BaseModel):
    location: str
    rain_24h: float
    wind_kmph: float
    humidity_percent: float


class PestRiskRequest(BaseModel):
    crop: str
    crop_stage: str
    location: str
    humidity_percent: float
    temp_c: float
    rain_7d_mm: float
    ndvi_anomaly: float
    pest_history: str = "none"  # none / low / high


@app.post("/advisory/crop-planning")
def crop_planning_endpoint(req: CropPlanningRequest):
    msgs = crop_planning(
        req.crop,
        req.location,
        req.sowing_date,
        req.soil_type,
        req.ndvi_trend
    )
    return {"status": "ok", "messages": msgs}


@app.post("/advisory/weather-alert")
def weather_alert_endpoint(req: WeatherAlertRequest):
    alerts = weather_alert(
        req.location,
        req.rain_24h,
        req.wind_kmph,
        req.humidity_percent
    )
    return {"status": "ok", "alerts": alerts}


@app.post("/advisory/pest-risk")
def pest_risk_endpoint(req: PestRiskRequest):
    level, reasons, recs = pest_risk(
        req.crop,
        req.crop_stage,
        req.humidity_percent,
        req.temp_c,
        req.rain_7d_mm,
        req.ndvi_anomaly,
        req.pest_history
    )
    return {
        "status": "ok",
        "risk_level": level,
        "reasons": reasons,
        "recommendations": recs
    }
