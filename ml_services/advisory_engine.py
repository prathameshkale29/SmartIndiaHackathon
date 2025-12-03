import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

MODEL_PATH = "models/pest_risk_model.pkl"


def train_pest_model():
    """Train a demo pest-risk model on synthetic data so you can show 'AI-based pest risk'."""
    data = {
        "humidity": np.random.uniform(40, 90, 400),
        "temp": np.random.uniform(20, 38, 400),
        "rain_7d": np.random.uniform(0, 80, 400),
        "ndvi_anomaly": np.random.uniform(-0.3, 0.2, 400),
        "critical_stage": np.random.choice([0, 1], 400),
    }
    df = pd.DataFrame(data)

    df["risk_score"] = (
        (df.humidity > 70).astype(int)
        + (df.rain_7d > 30).astype(int)
        + (df.critical_stage * 2).astype(int)
        + (df.ndvi_anomaly < -0.1).astype(int)
    )
    df["risk_label"] = df["risk_score"].apply(lambda x: 2 if x >= 4 else (1 if x >= 2 else 0))

    X = df[["humidity", "temp", "rain_7d", "ndvi_anomaly", "critical_stage"]]
    y = df["risk_label"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False)

    model = RandomForestClassifier(n_estimators=150, random_state=42, n_jobs=-1)
    model.fit(X_train, y_train)

    os.makedirs("models", exist_ok=True)
    joblib.dump({"model": model}, MODEL_PATH)
    print("✅ Pest risk model trained and saved at", MODEL_PATH)


def load_pest_model():
    if not os.path.exists(MODEL_PATH):
        train_pest_model()
    bundle = joblib.load(MODEL_PATH)
    return bundle["model"]


def crop_planning(crop, location, sowing_date, soil_type, ndvi_trend):
    messages = []
    d = datetime.fromisoformat(sowing_date)

    if 6 <= d.month <= 7:
        messages.append(f"Sowing window looks good for {crop} in {location}.")
    else:
        messages.append("You are outside the ideal sowing window – yield potential may be affected.")

    if soil_type.lower() in ["medium_black", "heavy_black", "black"]:
        messages.append("Soil holds moisture well – use normal seed rate and ensure drainage to avoid waterlogging.")
    else:
        messages.append("Soil may lose moisture faster – slightly higher seed rate and mulching are recommended.")

    if ndvi_trend == "increasing":
        messages.append("NDVI trend is increasing – vegetation is generally healthy in your area.")
    elif ndvi_trend == "decreasing":
        messages.append("NDVI is decreasing – there may be moisture or nutrient stress, field inspection is advised.")
    else:
        messages.append("NDVI is stable – monitor crop establishment and early growth.")

    return messages


def weather_alert(location, rain_24h, wind_kmph, humidity):
    alerts = []

    if rain_24h >= 50:
        alerts.append("⚠️ Heavy rainfall expected in the next 24 hours – avoid fertilizer and pesticide application.")
    elif 20 <= rain_24h < 50:
        alerts.append("ℹ️ Moderate rainfall expected – plan sowing and interculture operations accordingly.")

    if wind_kmph >= 15:
        alerts.append("⚠️ High wind speed – avoid spraying to reduce drift and wastage.")

    if humidity >= 80 and rain_24h > 0:
        alerts.append("⚠️ High humidity with rainfall – favorable conditions for fungal diseases. Monitor leaves closely.")

    if not alerts:
        alerts.append("✅ No major weather risk identified – normal field operations can continue.")

    return alerts


def pest_risk(crop, crop_stage, humidity, temp, rain_7d, ndvi_anomaly, pest_history):
    model = load_pest_model()
    critical_stage = 1 if crop_stage.lower() in ["flowering", "pod_filling", "fruiting"] else 0

    X_input = pd.DataFrame([{
        "humidity": humidity,
        "temp": temp,
        "rain_7d": rain_7d,
        "ndvi_anomaly": ndvi_anomaly,
        "critical_stage": critical_stage
    }])[["humidity", "temp", "rain_7d", "ndvi_anomaly", "critical_stage"]]

    pred = int(model.predict(X_input)[0])
    level = ["low", "medium", "high"][pred]

    reasons = []
    recommendations = []

    if level == "high":
        reasons.append("Weather and vegetation conditions are highly favorable for pest/disease outbreak.")
        recommendations.extend([
            "Carry out immediate field scouting using a 5×5 or W-shaped pattern.",
            "Install pheromone/light traps if applicable.",
            "If economic threshold level is crossed, follow recommended IPM/pesticide schedule from local experts."
        ])
    elif level == "medium":
        reasons.append("Conditions are moderately favorable for pest development.")
        recommendations.extend([
            "Increase scouting frequency to every 2–3 days.",
            "Prefer bio-control and cultural practices first (deep ploughing, rouging of infected plants)."
        ])
    else:
        reasons.append("Current conditions indicate a low pest risk.")
        recommendations.append("Maintain weekly monitoring and follow recommended agronomic practices.")

    if pest_history == "high":
        reasons.append("Your area has history of pest incidence – risk can escalate quickly.")
        recommendations.append("Stay prepared with recommended control measures and consult local extension workers.")

    return level, reasons, recommendations
