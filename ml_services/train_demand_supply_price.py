import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

DATA_PATH = "oilseed_timeseries.csv"
MODEL_DIR = "models"


def load_data(commodity_filter=None, region_filter=None):
    df = pd.read_csv(DATA_PATH)
    df["date"] = pd.to_datetime(df["date"])
    df = df.sort_values("date")

    if commodity_filter:
        df = df[df["commodity"].str.lower() == commodity_filter.lower()]
    if region_filter:
        df = df[df["region"].str.lower() == region_filter.lower()]

    df = df.dropna(subset=["price", "arrivals_tonnes", "demand_index"])
    return df


def create_features(df: pd.DataFrame):
    df = df.copy()

    # Time features
    df["dayofyear"] = df["date"].dt.dayofyear
    df["month"] = df["date"].dt.month
    df["weekofyear"] = df["date"].dt.isocalendar().week.astype(int)

    # Lag + rolling features for price, supply, demand
    for col in ["price", "arrivals_tonnes", "demand_index"]:
        df[f"{col}_lag1"] = df[col].shift(1)
        df[f"{col}_lag7"] = df[col].shift(7)
        df[f"{col}_lag30"] = df[col].shift(30)
        df[f"{col}_roll7"] = df[col].rolling(window=7).mean()
        df[f"{col}_roll30"] = df[col].rolling(window=30).mean()

    df = df.dropna()

    feature_cols = [
        "dayofyear", "month", "weekofyear",
        "price_lag1", "price_lag7", "price_lag30", "price_roll7", "price_roll30",
        "arrivals_tonnes_lag1", "arrivals_tonnes_lag7", "arrivals_tonnes_lag30",
        "arrivals_tonnes_roll7", "arrivals_tonnes_roll30",
        "demand_index_lag1", "demand_index_lag7", "demand_index_lag30",
        "demand_index_roll7", "demand_index_roll30",
    ]

    X = df[feature_cols]
    y_price = df["price"]
    y_supply = df["arrivals_tonnes"]
    y_demand = df["demand_index"]

    return X, y_price, y_supply, y_demand, feature_cols, df


def train_single_model(X, y, name: str):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=False
    )
    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"{name} MAE: {mae:.2f}")
    return model


def train_all(commodity="soybean", region="Nagpur"):
    print(f"Loading data for {commodity} - {region}...")
    df = load_data(commodity_filter=commodity, region_filter=region)

    if len(df) < 100:
        raise ValueError("Not enough data rows, need at least ~100 for decent model.")

    X, y_price, y_supply, y_demand, feature_cols, df_feat = create_features(df)

    print("Training price model...")
    price_model = train_single_model(X, y_price, "Price")

    print("Training supply model...")
    supply_model = train_single_model(X, y_supply, "Supply")

    print("Training demand model...")
    demand_model = train_single_model(X, y_demand, "Demand")

    os.makedirs(MODEL_DIR, exist_ok=True)
    bundle = {
        "price_model": price_model,
        "supply_model": supply_model,
        "demand_model": demand_model,
        "feature_cols": feature_cols,
        "last_row": df_feat.iloc[-1:].copy(),
        "commodity": commodity,
        "region": region,
    }
    model_path = os.path.join(MODEL_DIR, f"{commodity}_{region}_bundle.pkl")
    joblib.dump(bundle, model_path)
    print(f"Saved models to {model_path}")


if __name__ == "__main__":
    train_all(commodity="soybean", region="Nagpur")
