import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os
import random

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

# ---------------------------------------------------------
# NEW FEATURES: Oilseed Advisory, Price Prediction & Logistics
# ---------------------------------------------------------

def recommend_oilseeds(region, soil_type):
    """
    Identifies suitable oilseeds based on region and soil type.
    """
    recommendations = []
    soil_type = soil_type.lower()
    
    # Logic for Central India (Maharashtra/MP based on typical hackathon context)
    if "black" in soil_type or "clay" in soil_type:
        recommendations.append({
            "crop": "Soybean",
            "suitability": "High",
            "reason": "Black soil retains moisture well, ideal for Soybean."
        })
        recommendations.append({
             "crop": "Sunflower",
             "suitability": "Medium",
             "reason": "Good option but requires well-drained soil."
        })
    
    if "loam" in soil_type or "sandy" in soil_type or "red" in soil_type:
        recommendations.append({
            "crop": "Groundnut",
            "suitability": "High",
            "reason": "Loose soil allows peg penetration for pod formation."
        })
        recommendations.append({
            "crop": "Mustard",
            "suitability": "High",
            "reason": "Thrives in loamy soil with less water requirement."
        })
        
    # Fallback / Generic
    if not recommendations:
         recommendations.append({
            "crop": "Soybean",
            "suitability": "Medium",
            "reason": "General recommendation for your region."
        })

    return recommendations

def get_market_analysis(crop):
    """
    Returns MSP, Production trends, and basic market demand stats.
    Mock data simluating government open data API.
    Step 4, 5, 6
    """
    market_db = {
        "Soybean": {
            "msp": 4600,
            "production_trend": "Stable",
            "demand": "High (Edible Oil Industry)",
            "avg_yield_per_acre": 6  # Quintals
        },
        "Mustard": {
            "msp": 5450,
            "production_trend": "Increasing",
            "demand": "Very High (Winter Demand)",
             "avg_yield_per_acre": 5
        },
        "Groundnut": {
            "msp": 6377,
             "production_trend": "Volatile",
            "demand": "Moderate",
             "avg_yield_per_acre": 8
        },
        "Sunflower": {
             "msp": 6400,
             "production_trend": "Decreasing",
             "demand": "High",
             "avg_yield_per_acre": 5
        }
    }
    
    return market_db.get(crop, {
        "msp": 0,
        "production_trend": "Unknown",
        "demand": "Unknown",
        "avg_yield_per_acre": 0
    })

def predict_expected_price(crop):
    """
    Step 7, 9, 10
    Simulates AI Model predicting future price based on market factor.
    Returns: Expected Price, Confidence Range, and Trend Analysis.
    """
    base_data = get_market_analysis(crop)
    msp = base_data['msp']
    if msp == 0: return None
    
    # Simulate AI fluctuation
    volatility = random.uniform(-0.05, 0.15) # -5% to +15% over MSP
    expected_price = int(msp * (1 + volatility))
    
    # 2-3 months forecast
    future_trend = []
    current_month = datetime.now()
    for i in range(1, 4):
        month_name = (current_month + timedelta(days=30*i)).strftime("%b")
        trend_factor = random.uniform(0.98, 1.05)
        future_trend.append({
            "month": month_name,
            "price": int(expected_price * trend_factor)
        })
        
    return {
        "current_msp": msp,
        "expected_price": expected_price,
        "range_low": int(expected_price * 0.95),
        "range_high": int(expected_price * 1.05),
        "recommendation": "Hold" if expected_price > msp * 1.1 else "Sell",
        "future_trend": future_trend,
        "demand_factors": ["International Price Hike", "Festival Demand"] if volatility > 0 else ["Surplus Production"]
    }

def calculate_logistics_cost(quantity_quintal, distance_km):
    """
    Step 12, 13
    Auto vs Tempo logic.
    """
    quantity_quintal = float(quantity_quintal)
    distance_km = float(distance_km)
    
    vehicle_type = "Tempo (Small Truck)" if quantity_quintal >= 10 else "Auto (3-Wheeler)"
    
    # Rates
    if vehicle_type == "Auto (3-Wheeler)":
        base_charge = 200
        per_km = 15
        capacity_charge = 0 # Included for small load
    else:
        base_charge = 500
        per_km = 25
        capacity_charge = (quantity_quintal - 10) * 20 # Extra charge per quintal over 10
        
    total_cost = base_charge + (distance_km * per_km) + capacity_charge
    
    return {
        "vehicle": vehicle_type,
        "base_charge": base_charge,
        "distance_cost": distance_km * per_km,
        "capacity_surcharge": capacity_charge,
        "total_cost": int(total_cost),
        "per_quintal_cost": int(total_cost / quantity_quintal)
    }
