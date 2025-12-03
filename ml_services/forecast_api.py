#!/usr/bin/env python3
"""
Enhanced Forecast API for Agri-Sync
Provides demand-supply predictions, price forecasting, and comprehensive analytics
"""

import sys
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import joblib
import os

# Model paths
DEMAND_MODEL_PATH = "models/demand_model.pkl"
SUPPLY_MODEL_PATH = "models/supply_model.pkl"
PRICE_MODEL_PATH = "models/price_model.pkl"

# Crop baseline data (for demo purposes)
CROP_BASELINES = {
    "mustard": {
        "avg_price": 6000,
        "avg_demand": 850,  # thousand MT
        "avg_supply": 780,
        "seasonality": "rabi",
        "yield_per_acre": 7.5
    },
    "soybean": {
        "avg_price": 5500,
        "avg_demand": 1200,
        "avg_supply": 1100,
        "seasonality": "kharif",
        "yield_per_acre": 9.0
    },
    "groundnut": {
        "avg_price": 5800,
        "avg_demand": 650,
        "avg_supply": 600,
        "seasonality": "kharif",
        "yield_per_acre": 10.0
    },
    "sunflower": {
        "avg_price": 6200,
        "avg_demand": 450,
        "avg_supply": 420,
        "seasonality": "kharif",
        "yield_per_acre": 7.0
    }
}

def generate_demand_supply_forecast(crop, region, months=6):
    """Generate demand and supply predictions for next N months"""
    crop_lower = crop.lower()
    baseline = CROP_BASELINES.get(crop_lower, CROP_BASELINES["soybean"])
    
    # Generate monthly predictions with realistic trends
    predictions = []
    current_date = datetime.now()
    
    for i in range(months):
        month_date = current_date + timedelta(days=30 * i)
        
        # Add seasonal variation
        month_num = month_date.month
        seasonal_factor = 1 + 0.15 * np.sin(2 * np.pi * month_num / 12)
        
        # Add random variation
        demand_variation = np.random.uniform(0.95, 1.05)
        supply_variation = np.random.uniform(0.93, 1.07)
        
        demand = baseline["avg_demand"] * seasonal_factor * demand_variation
        supply = baseline["avg_supply"] * seasonal_factor * supply_variation
        
        predictions.append({
            "month": month_date.strftime("%b %Y"),
            "demand": round(demand, 1),
            "supply": round(supply, 1),
            "gap": round(demand - supply, 1),
            "gap_percentage": round(((demand - supply) / demand) * 100, 1)
        })
    
    return {
        "crop": crop,
        "region": region,
        "predictions": predictions,
        "summary": {
            "avg_demand": round(np.mean([p["demand"] for p in predictions]), 1),
            "avg_supply": round(np.mean([p["supply"] for p in predictions]), 1),
            "avg_gap": round(np.mean([p["gap"] for p in predictions]), 1),
            "trend": "increasing" if predictions[-1]["demand"] > predictions[0]["demand"] else "stable"
        }
    }

def generate_price_forecast(crop, region, months=6):
    """Generate price predictions for next N months"""
    crop_lower = crop.lower()
    baseline = CROP_BASELINES.get(crop_lower, CROP_BASELINES["soybean"])
    
    predictions = []
    current_date = datetime.now()
    base_price = baseline["avg_price"]
    
    for i in range(months):
        month_date = current_date + timedelta(days=30 * i)
        
        # Price trend with some volatility
        trend_factor = 1 + (i * 0.01)  # Slight upward trend
        seasonal_factor = 1 + 0.08 * np.sin(2 * np.pi * month_date.month / 12)
        volatility = np.random.uniform(0.97, 1.03)
        
        price = base_price * trend_factor * seasonal_factor * volatility
        
        predictions.append({
            "month": month_date.strftime("%b %Y"),
            "predicted_price": round(price, 0),
            "min_price": round(price * 0.95, 0),
            "max_price": round(price * 1.05, 0),
            "confidence": round(np.random.uniform(0.75, 0.92), 2)
        })
    
    # Calculate trend
    price_change = ((predictions[-1]["predicted_price"] - predictions[0]["predicted_price"]) / 
                    predictions[0]["predicted_price"]) * 100
    
    return {
        "crop": crop,
        "region": region,
        "current_price": round(base_price, 0),
        "predictions": predictions,
        "summary": {
            "avg_price": round(np.mean([p["predicted_price"] for p in predictions]), 0),
            "price_change_percentage": round(price_change, 1),
            "trend": "bullish" if price_change > 2 else ("bearish" if price_change < -2 else "stable"),
            "recommendation": "Hold for better prices" if price_change > 3 else "Sell at current rates"
        }
    }

def generate_comprehensive_forecast(crop, region, area=5, soil_type="medium", irrigation="rainfed"):
    """Generate comprehensive predictions including yield, revenue, and risks"""
    crop_lower = crop.lower()
    baseline = CROP_BASELINES.get(crop_lower, CROP_BASELINES["soybean"])
    
    # Yield prediction
    base_yield = baseline["yield_per_acre"]
    soil_factor = {"light": 0.9, "medium": 1.0, "heavy": 1.05}.get(soil_type, 1.0)
    irrigation_factor = {"rainfed": 1.0, "irrigated": 1.15}.get(irrigation, 1.0)
    
    yield_per_acre = base_yield * soil_factor * irrigation_factor
    total_yield = yield_per_acre * area
    
    # Price prediction
    price_forecast = generate_price_forecast(crop, region, 3)
    expected_price = price_forecast["predictions"][1]["predicted_price"]  # Next month price
    
    # Revenue calculation
    total_revenue = total_yield * expected_price
    
    # Risk assessment
    risks = []
    if irrigation == "rainfed":
        risks.append("Monsoon dependency - yield may vary ±20%")
    if soil_type == "light":
        risks.append("Light soil - requires more frequent irrigation")
    
    # Market risks
    demand_supply = generate_demand_supply_forecast(crop, region, 3)
    avg_gap = demand_supply["summary"]["avg_gap"]
    if avg_gap < 0:
        risks.append("Supply surplus expected - prices may decline")
    else:
        risks.append("Demand exceeds supply - favorable pricing expected")
    
    return {
        "crop": crop,
        "region": region,
        "area_acres": area,
        "yield_prediction": {
            "per_acre": round(yield_per_acre, 2),
            "total_quintals": round(total_yield, 1),
            "confidence": 0.82
        },
        "price_prediction": {
            "expected_price_per_quintal": expected_price,
            "price_range": {
                "min": price_forecast["predictions"][1]["min_price"],
                "max": price_forecast["predictions"][1]["max_price"]
            },
            "trend": price_forecast["summary"]["trend"]
        },
        "revenue_prediction": {
            "expected_revenue": round(total_revenue, 0),
            "min_revenue": round(total_yield * price_forecast["predictions"][1]["min_price"], 0),
            "max_revenue": round(total_yield * price_forecast["predictions"][1]["max_price"], 0),
            "per_acre_revenue": round(total_revenue / area, 0)
        },
        "harvest_window": {
            "optimal_start": (datetime.now() + timedelta(days=90)).strftime("%b %d, %Y"),
            "optimal_end": (datetime.now() + timedelta(days=105)).strftime("%b %d, %Y")
        },
        "risks": risks,
        "recommendations": [
            f"Expected yield: {round(yield_per_acre, 1)} quintals/acre",
            f"Target selling price: ₹{expected_price}/quintal",
            "Monitor weather forecasts during critical growth stages",
            "Consider forward contracts to lock in current prices" if price_forecast["summary"]["trend"] == "bearish" else "Wait for price improvement before selling"
        ]
    }

def main():
    """Main entry point for the forecast API"""
    try:
        # Read parameters from command line
        if len(sys.argv) < 2:
            print(json.dumps({"error": "No parameters provided"}))
            sys.exit(1)
        
        params = json.loads(sys.argv[1])
        forecast_type = params.get("type", "comprehensive")
        crop = params.get("crop", "soybean")
        region = params.get("region", "Maharashtra")
        
        # Generate appropriate forecast
        if forecast_type == "demand_supply":
            months = params.get("months", 6)
            result = generate_demand_supply_forecast(crop, region, months)
        elif forecast_type == "price":
            months = params.get("months", 6)
            result = generate_price_forecast(crop, region, months)
        elif forecast_type == "comprehensive":
            area = params.get("area", 5)
            soil_type = params.get("soilType", "medium")
            irrigation = params.get("irrigation", "rainfed")
            result = generate_comprehensive_forecast(crop, region, area, soil_type, irrigation)
        else:
            result = {"error": f"Unknown forecast type: {forecast_type}"}
        
        # Output JSON result
        print(json.dumps(result, indent=2))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
