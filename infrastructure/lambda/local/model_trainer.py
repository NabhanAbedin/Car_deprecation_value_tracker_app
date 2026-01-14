"""
Model Trainer Script
Trains KNN model on cleaned car data and saves model artifacts.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import json


def prepare_features(df):
    """
    Convert categorical features to numerical and prepare feature matrix.
    Returns: X (features), y (target), encoders (for later use)
    """
    print("Encoding categorical features...")

    # Create a copy to avoid modifying original
    df_encoded = df.copy()

    # Initialize encoders
    brand_encoder = LabelEncoder()
    model_encoder = LabelEncoder()

    # Encode Brand and Model
    df_encoded['Brand_encoded'] = brand_encoder.fit_transform(df_encoded['Brand'])
    df_encoded['Model_encoded'] = model_encoder.fit_transform(df_encoded['Model'])

    # Select features for model
    # Features: Year, Mileage, ConditionScore, Brand_encoded, Model_encoded
    feature_columns = ['Year', 'Mileage', 'ConditionScore', 'Brand_encoded', 'Model_encoded']
    X = df_encoded[feature_columns].values

    # Target: SoldPrice
    y = df_encoded['SoldPrice'].values

    print(f"Feature matrix shape: {X.shape}")
    print(f"Target vector shape: {y.shape}")

    # Save encoders for later use
    encoders = {
        'brand_encoder': brand_encoder,
        'model_encoder': model_encoder,
        'feature_columns': feature_columns
    }

    return X, y, encoders


def train_knn_model(X, y, k=5):
    """
    Train KNN regressor model.
    """
    print(f"\nTraining KNN model with k={k}...")

    # Split data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")

    # Scale features (CRITICAL for KNN!)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Train KNN model
    knn = KNeighborsRegressor(n_neighbors=k, weights='distance', metric='euclidean')
    knn.fit(X_train_scaled, y_train)

    print("✓ Model trained successfully!")

    # Evaluate model
    print("\n" + "="*60)
    print("MODEL EVALUATION")
    print("="*60)

    # Predictions
    y_pred_train = knn.predict(X_train_scaled)
    y_pred_test = knn.predict(X_test_scaled)

    # Training metrics
    train_mae = mean_absolute_error(y_train, y_pred_train)
    train_rmse = np.sqrt(mean_squared_error(y_train, y_pred_train))
    train_r2 = r2_score(y_train, y_pred_train)

    print(f"\nTraining Set Metrics:")
    print(f"  MAE:  ${train_mae:,.2f}")
    print(f"  RMSE: ${train_rmse:,.2f}")
    print(f"  R²:   {train_r2:.4f}")

    # Test metrics
    test_mae = mean_absolute_error(y_test, y_pred_test)
    test_rmse = np.sqrt(mean_squared_error(y_test, y_pred_test))
    test_r2 = r2_score(y_test, y_pred_test)

    print(f"\nTest Set Metrics:")
    print(f"  MAE:  ${test_mae:,.2f}")
    print(f"  RMSE: ${test_rmse:,.2f}")
    print(f"  R²:   {test_r2:.4f}")

    # Cross-validation
    print("\nPerforming 5-fold cross-validation...")
    cv_scores = cross_val_score(knn, X_train_scaled, y_train, cv=5,
                                  scoring='neg_mean_absolute_error')
    cv_mae = -cv_scores.mean()
    cv_std = cv_scores.std()

    print(f"  Cross-Val MAE: ${cv_mae:,.2f} (+/- ${cv_std:,.2f})")

    # Sample predictions
    print("\n" + "="*60)
    print("SAMPLE PREDICTIONS (First 5 test examples)")
    print("="*60)
    for i in range(min(5, len(y_test))):
        print(f"Actual: ${y_test[i]:,.0f}  |  Predicted: ${y_pred_test[i]:,.0f}  |  Error: ${abs(y_test[i] - y_pred_test[i]):,.0f}")

    # Prepare metrics summary
    metrics = {
        'k': k,
        'train_mae': float(train_mae),
        'train_rmse': float(train_rmse),
        'train_r2': float(train_r2),
        'test_mae': float(test_mae),
        'test_rmse': float(test_rmse),
        'test_r2': float(test_r2),
        'cv_mae': float(cv_mae),
        'cv_std': float(cv_std),
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }

    return knn, scaler, metrics


def save_model_artifacts(knn, scaler, encoders, metrics, output_dir="data/models"):
    """
    Save trained model, scaler, encoders, and metrics.
    """
    print(f"\nSaving model artifacts to {output_dir}/...")

    # Save KNN model
    joblib.dump(knn, f"{output_dir}/knn_model.joblib")
    print("✓ Saved knn_model.joblib")

    # Save scaler
    joblib.dump(scaler, f"{output_dir}/scaler.joblib")
    print("✓ Saved scaler.joblib")

    # Save encoders
    joblib.dump(encoders, f"{output_dir}/encoders.joblib")
    print("✓ Saved encoders.joblib")

    # Save metrics as JSON
    with open(f"{output_dir}/metrics.json", 'w') as f:
        json.dump(metrics, f, indent=2)
    print("✓ Saved metrics.json")

    print("\n✓ All model artifacts saved successfully!")


def main():
    """
    Main training pipeline.
    """
    # File paths
    INPUT_CSV = "data/cleaned/cars_cleaned.csv"
    OUTPUT_DIR = "data/models"

    # Load cleaned data
    print("Loading cleaned data...")
    df = pd.read_csv(INPUT_CSV)
    print(f"Loaded {len(df)} records")

    # Prepare features
    X, y, encoders = prepare_features(df)

    # Train model
    knn, scaler, metrics = train_knn_model(X, y, k=5)

    # Save artifacts
    save_model_artifacts(knn, scaler, encoders, metrics, OUTPUT_DIR)

    print("\n" + "="*60)
    print("✓ MODEL TRAINING COMPLETE!")
    print("="*60)
    print("\nNext steps:")
    print("1. Review metrics.json to check model performance")
    print("2. Run predictor.py to test predictions")
    print("3. Upload cleaned data to your local PostgreSQL database")


if __name__ == "__main__":
    main()
