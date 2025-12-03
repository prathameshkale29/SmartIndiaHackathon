ML + Advisory Microservices
===========================

This folder contains two FastAPI-based services:

1) Demand–Supply–Price Forecasting
----------------------------------
- Train the model:
    python train_demand_supply_price.py
  (expects an 'oilseed_timeseries.csv' file with columns like:
   date, commodity, region, price, arrivals_tonnes, demand_index)

- Run the forecast API:
    uvicorn forecast_api:app --reload --port 8001

- Endpoint:
    POST /forecast
    Body: { "commodity": "soybean", "region": "Nagpur", "days_ahead": 7 }

2) AI Advisory Engine (Crop planning, Weather, Pest)
----------------------------------------------------
- Run:
    uvicorn advisory_api:app --reload --port 8010

- Endpoints:
    POST /advisory/crop-planning
    POST /advisory/weather-alert
    POST /advisory/pest-risk

You can call these directly from the React dashboard using fetch()
and show the returned advisories in cards or tables.
