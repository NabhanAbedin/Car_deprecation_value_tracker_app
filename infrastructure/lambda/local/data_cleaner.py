"""
Data Cleaner Script
Cleans raw car dataset and prepares it for KNN model training.
Handles: Brand/Model splitting, missing values, outliers, condition normalization.
"""

import pandas as pd
import re
from datetime import datetime
import random


def split_brand_model(model_string):
    """
    Splits 'ToyotaCamry' into ('Toyota', 'Camry')
    Logic: Find first uppercase letter after the first character
    """
    if pd.isna(model_string) or not isinstance(model_string, str):
        return None, None

    # Find the position of the second uppercase letter
    match = re.search(r'[A-Z][a-z]+([A-Z])', model_string)
    if match:
        split_pos = match.start(1)
        brand = model_string[:split_pos].strip()
        model = model_string[split_pos:].strip()
        return brand, model

    # If no second uppercase found, treat entire string as brand
    return model_string, "Unknown"


def normalize_condition(condition_value):
    """
    Convert various condition formats to 1-10 scale.
    Handles: numeric values, text labels, or ratings
    """
    if pd.isna(condition_value):
        return None

    # If already numeric between 1-10, keep it
    try:
        val = float(condition_value)
        if 1 <= val <= 10:
            return int(round(val))
        # If it's 0-5 scale, convert to 1-10
        elif 0 <= val <= 5:
            return int(round(val * 2))
        # If it's 0-100 scale, convert to 1-10
        elif 0 <= val <= 100:
            return int(round(val / 10))
    except (ValueError, TypeError):
        pass

    # Handle text labels (if dataset uses "Excellent", "Good", etc.)
    condition_map = {
        'excellent': 10,
        'very good': 8,
        'good': 7,
        'fair': 5,
        'poor': 3,
    }

    condition_str = str(condition_value).lower()
    for key, value in condition_map.items():
        if key in condition_str:
            return value

    # Default to 5 if can't parse
    return 5


def generate_synthetic_date(year):
    """
    Generate a synthetic sale date based on car year.
    Assumes cars are sold 1-5 years after manufacture.
    """
    try:
        car_year = int(year)
        # Generate sale date between 1-5 years after car year
        years_after = random.randint(1, 5)
        sale_year = car_year + years_after

        # Random month and day
        month = random.randint(1, 12)
        day = random.randint(1, 28)  # Safe for all months

        return datetime(sale_year, month, day)
    except:
        # Default to today's date
        return datetime.now()


def clean_data(input_csv_path, output_csv_path):
    """
    Main cleaning function.
    """
    print(f"Loading data from {input_csv_path}...")
    df = pd.read_csv(input_csv_path)

    print(f"Initial dataset size: {len(df)} rows")
    print(f"Columns: {df.columns.tolist()}")

    # Step 1: Split Model column into Brand and Model
    print("\n[1/7] Splitting Brand and Model...")
    df[['Brand', 'Model']] = df['Model'].apply(
        lambda x: pd.Series(split_brand_model(x))
    )

    # Step 2: Clean column names to match expected format
    print("[2/7] Renaming columns...")
    column_mapping = {
        'Year': 'Year',
        'Selling Price': 'SoldPrice',
        'Kilometers Driven': 'Mileage',
        'Car Condition': 'ConditionScore',
    }

    # Rename columns if they exist
    for old_name, new_name in column_mapping.items():
        if old_name in df.columns:
            df.rename(columns={old_name: new_name}, inplace=True)

    # Step 3: Handle missing values
    print("[3/7] Handling missing values...")
    # Drop rows with missing critical fields
    df = df.dropna(subset=['Brand', 'Model', 'Year', 'SoldPrice', 'Mileage'])

    # Step 4: Normalize Condition Score
    print("[4/7] Normalizing condition scores...")
    df['ConditionScore'] = df['ConditionScore'].apply(normalize_condition)
    df = df.dropna(subset=['ConditionScore'])  # Drop if condition couldn't be parsed

    # Step 5: Convert Kilometers to Miles (if needed)
    print("[5/7] Converting mileage to miles...")
    if df['Mileage'].mean() > 50000:  # Likely in kilometers
        df['Mileage'] = (df['Mileage'] * 0.621371).astype(int)
        print("  Converted from kilometers to miles")

    # Step 6: Remove outliers
    print("[6/7] Removing outliers...")
    initial_count = len(df)

    # Remove cars with unrealistic values
    df = df[df['Year'] >= 1900]
    df = df[df['Year'] <= datetime.now().year + 1]
    df = df[df['Mileage'] >= 0]
    df = df[df['Mileage'] <= 500000]  # Max 500k miles
    df = df[df['SoldPrice'] > 0]
    df = df[df['SoldPrice'] <= 10000000]  # Max $10M

    outliers_removed = initial_count - len(df)
    print(f"  Removed {outliers_removed} outlier rows")

    # Step 7: Generate synthetic SoldDate
    print("[7/7] Generating sale dates...")
    df['SoldDate'] = df['Year'].apply(generate_synthetic_date)

    # Step 8: Select only needed columns
    final_columns = ['Brand', 'Model', 'Year', 'Mileage', 'ConditionScore', 'SoldPrice', 'SoldDate']
    df = df[final_columns]

    # Step 9: Reset index
    df = df.reset_index(drop=True)

    # Print summary statistics
    print("\n" + "="*60)
    print("CLEANING COMPLETE")
    print("="*60)
    print(f"Final dataset size: {len(df)} rows")
    print(f"\nSummary Statistics:")
    print(df.describe())
    print(f"\nBrand distribution (top 10):")
    print(df['Brand'].value_counts().head(10))
    print(f"\nCondition Score distribution:")
    print(df['ConditionScore'].value_counts().sort_index())

    # Save cleaned data
    df.to_csv(output_csv_path, index=False)
    print(f"\nCleaned data saved to: {output_csv_path}")

    return df


if __name__ == "__main__":
    # File paths
    INPUT_CSV = "data/raw/cars_raw.csv"
    OUTPUT_CSV = "data/cleaned/cars_cleaned.csv"

    # Run cleaning
    cleaned_df = clean_data(INPUT_CSV, OUTPUT_CSV)

    print("\n✓ Data cleaning complete! Next step: Run model_trainer.py")
