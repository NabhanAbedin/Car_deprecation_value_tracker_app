"""
Predictor Script
Tests trained KNN model with sample car inputs.
This simulates what the Lambda function will do.
"""

import pandas as pd
import numpy as np
import joblib
import json


def load_model_artifacts(model_dir="data/models"):
    """
    Load trained model, scaler, and encoders.
    """
    print(f"Loading model artifacts from {model_dir}/...")

    knn = joblib.load(f"{model_dir}/knn_model.joblib")
    scaler = joblib.load(f"{model_dir}/scaler.joblib")
    encoders = joblib.load(f"{model_dir}/encoders.joblib")

    print("✓ Model artifacts loaded successfully!")

    # Load metrics for reference
    with open(f"{model_dir}/metrics.json", 'r') as f:
        metrics = json.load(f)

    print(f"\nModel Info:")
    print(f"  K-neighbors: {metrics['k']}")
    print(f"  Test MAE: ${metrics['test_mae']:,.2f}")
    print(f"  Test R²: {metrics['test_r2']:.4f}")

    return knn, scaler, encoders


def load_training_data(csv_path="data/cleaned/cars_cleaned.csv"):
    """
    Load training data to get neighbor information.
    """
    df = pd.read_csv(csv_path)
    return df


def predict_price(knn, scaler, encoders, training_df, car_input):
    """
    Predict car price and return nearest neighbors.

    Args:
        car_input: dict with keys: brand, model, year, mileage, condition_score

    Returns:
        dict with predicted_price and neighbors
    """
    brand_encoder = encoders['brand_encoder']
    model_encoder = encoders['model_encoder']

    # Encode categorical features
    try:
        brand_encoded = brand_encoder.transform([car_input['brand']])[0]
    except ValueError:
        print(f"Warning: Brand '{car_input['brand']}' not in training data. Using fallback.")
        brand_encoded = 0  # Fallback to first brand

    try:
        model_encoded = model_encoder.transform([car_input['model']])[0]
    except ValueError:
        print(f"Warning: Model '{car_input['model']}' not in training data. Using fallback.")
        model_encoded = 0  # Fallback to first model

    # Create feature vector
    features = np.array([[
        car_input['year'],
        car_input['mileage'],
        car_input['condition_score'],
        brand_encoded,
        model_encoded
    ]])

    # Scale features
    features_scaled = scaler.transform(features)

    # Predict price
    predicted_price = knn.predict(features_scaled)[0]

    # Get nearest neighbors
    distances, indices = knn.kneighbors(features_scaled, n_neighbors=5)

    # Encode training data for matching
    training_df_encoded = training_df.copy()
    training_df_encoded['Brand_encoded'] = brand_encoder.transform(training_df['Brand'])
    training_df_encoded['Model_encoded'] = model_encoder.transform(training_df['Model'])

    # Extract neighbor information
    neighbors = []
    for idx, dist in zip(indices[0], distances[0]):
        neighbor = training_df.iloc[idx]
        neighbors.append({
            'brand': neighbor['Brand'],
            'model': neighbor['Model'],
            'year': int(neighbor['Year']),
            'mileage': int(neighbor['Mileage']),
            'condition_score': int(neighbor['ConditionScore']),
            'sold_price': int(neighbor['SoldPrice']),
            'distance': float(dist)
        })

    return {
        'predicted_price': int(predicted_price),
        'neighbors': neighbors
    }


def test_predictions():
    """
    Run test predictions with sample inputs.
    """
    # Load model and data
    knn, scaler, encoders = load_model_artifacts()
    training_df = load_training_data()

    # Test cases
    test_cars = [
        {
            'brand': 'Toyota',
            'model': 'Camry',
            'year': 2015,
            'mileage': 50000,
            'condition_score': 8
        },
        {
            'brand': 'BMW',
            'model': '3Series',
            'year': 2018,
            'mileage': 30000,
            'condition_score': 9
        },
        {
            'brand': 'Honda',
            'model': 'Civic',
            'year': 2020,
            'mileage': 15000,
            'condition_score': 10
        }
    ]

    print("\n" + "="*60)
    print("TEST PREDICTIONS")
    print("="*60)

    for i, car in enumerate(test_cars, 1):
        print(f"\n--- Test Case {i} ---")
        print(f"Input: {car['year']} {car['brand']} {car['model']}")
        print(f"       {car['mileage']} miles, Condition: {car['condition_score']}/10")

        result = predict_price(knn, scaler, encoders, training_df, car)

        print(f"\nPredicted Price: ${result['predicted_price']:,}")
        print(f"\nNearest Neighbors (Top 3):")
        for j, neighbor in enumerate(result['neighbors'][:3], 1):
            print(f"  {j}. {neighbor['year']} {neighbor['brand']} {neighbor['model']}")
            print(f"     ${neighbor['sold_price']:,} | {neighbor['mileage']} mi | Condition: {neighbor['condition_score']}/10")
            print(f"     Distance: {neighbor['distance']:.4f}")


def interactive_mode():
    """
    Interactive mode for manual testing.
    """
    print("\n" + "="*60)
    print("INTERACTIVE PREDICTION MODE")
    print("="*60)

    # Load model and data
    knn, scaler, encoders = load_model_artifacts()
    training_df = load_training_data()

    while True:
        print("\nEnter car details (or 'quit' to exit):")

        brand = input("Brand (e.g., Toyota, BMW): ").strip()
        if brand.lower() == 'quit':
            break

        model = input("Model (e.g., Camry, 3Series): ").strip()
        year = int(input("Year (e.g., 2015): ").strip())
        mileage = int(input("Mileage (e.g., 50000): ").strip())
        condition_score = int(input("Condition Score (1-10): ").strip())

        car_input = {
            'brand': brand,
            'model': model,
            'year': year,
            'mileage': mileage,
            'condition_score': condition_score
        }

        result = predict_price(knn, scaler, encoders, training_df, car_input)

        print(f"\n{'='*40}")
        print(f"Predicted Price: ${result['predicted_price']:,}")
        print(f"{'='*40}")

        print("\nTop 3 Similar Cars:")
        for j, neighbor in enumerate(result['neighbors'][:3], 1):
            print(f"{j}. {neighbor['year']} {neighbor['brand']} {neighbor['model']} - ${neighbor['sold_price']:,}")


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == '--interactive':
        interactive_mode()
    else:
        test_predictions()
        print("\n\nTip: Run with --interactive flag for manual testing")
        print("Example: python predictor.py --interactive")
