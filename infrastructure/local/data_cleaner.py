

import pandas as pd
import re
from datetime import datetime
import random
import joblib 
from sklearn.preprocessing import MinMaxScaler


def data_cleaner(csv_path):

    df = pd.read_csv(csv_path)

    df = df.rename(columns={
    'Selling Price': 'SoldPrice',
    'Kilometers Driven': 'Kilometers',
    'Fuel Type': 'FuelType',
    'Car Condition': 'ConditionScore'
    })
    
    df = df.drop(columns=["Insurance"], errors="ignore")
    df = df.dropna(subset=["SoldPrice"])

    usd_conversion = 0.012
    df["SoldPrice"] = (df['SoldPrice'] * usd_conversion).round(2)

    def add_spaces_at_caps(text):
        return re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', str(text))
    
    df["Model"] = df["Model"].apply(add_spaces_at_caps)

    new_cols = df["Model"].str.split(" ", n=1, expand=True)
    df["Brand"] = new_cols[0].str.strip().str.lower()
    df["Model"] = new_cols[1].str.strip().str.lower()

    df["ConditionScore"] = df["ConditionScore"] * 2

    current_year = datetime.now().year

    df["Age"] = current_year - df["Year"]
    df['FuelType'] = df['FuelType'].apply(
        lambda x: 'Petrol' if 'Petrol' in str(x) else 'Diesel'
    )
    df["Transmission"] = df["Transmission"].apply(lambda x: 'MANUAL' if 'MANUAL' in str(x).upper() else 'AUTOMATIC')

    return df



def generate_vectors(df):

    owner_map = {
    "First Owner": 1,
    "Second Owner": 2,
    "Third Owner": 3,
    }

    df["OwnerRank"] = df["Owner"].apply(lambda x: owner_map.get(x, 1))

    df = pd.get_dummies(df, columns=["FuelType", "Transmission"], dtype=int)
    

    scaler = MinMaxScaler()
    cols_to_scale = ["Age", "Kilometers", "ConditionScore", "OwnerRank"]

    scaled_features = scaler.fit_transform(df[cols_to_scale])

    binary_cols = ["FuelType_Petrol", "FuelType_Diesel", 
        "Transmission_MANUAL", "Transmission_AUTOMATIC"]
    
    for col in binary_cols:
        if col not in df.columns:
            df[col] = 0
    

    df["FeaturesVector"] = [
        [float(x) for x in scaled] + [int(x) for x in binary] for scaled, binary in zip(scaled_features, df[binary_cols].values)
    ]

    return df, scaler


def main(file_path):
    
    cleaned_df = data_cleaner(file_path)

    final_df, scaler = generate_vectors(cleaned_df)
    final_df.to_csv("final_car_vectors.csv", index=False)

    joblib.dump(scaler, "scaler")

    print(final_df.head(5).to_string())


if __name__ == "__main__":
    final_data = main('infrastructure/local/car_data.csv')




