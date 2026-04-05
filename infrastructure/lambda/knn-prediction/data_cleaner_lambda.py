import re
from datetime import datetime
import json
import io
import pandas as pd
import joblib
import boto3
from sklearn.preprocessing import MinMaxScaler
import psycopg2
from psycopg2.extras import execute_values
import os

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

def save_scalar_to_s3(scalar, bucket_name, file_key):
    s3 = boto3.client('s3')

    scalar_buffer = io.BytesIO()
    joblib.dump(scalar, scalar_buffer)

    scalar_buffer.seek(0)
    s3.put_object(
        Bucket=bucket_name,
        Key=file_key,
        Body=scalar_buffer.getvalue()
    )


def event_handler(event, context):
    
    try:
        raw_csv_string = event.get('csv_data')
        csv_buffer = io.StringIO(raw_csv_string)

        df = data_cleaner(csv_buffer)
        df_processed, scalar = generate_vectors(df)

        df_processed['FeaturesVector'] = df_processed['FeaturesVector'].apply(lambda x: str(x))

        conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=os.environ['DB_PASSWORD']
        )

        cur = conn.cursor()

        columns = [
            'Brand', 'Model', 'Year', 'ConditionScore', 
            'Kilometers', 'SoldPrice', 'Age', 'Transmission', 
            'FuelType', 'Owner', 'FeaturesVector'
        ]

        data_to_insert = df_processed[columns].values.tolist()
        insert_query = f"INSERT INTO market_data ({','.join(columns)}) VALUES %s"

        execute_values(cur, insert_query, data_to_insert)

        conn.commit()
        cur.close()
        conn.close()

        save_scalar_to_s3(scalar, os.environ['S3_BUCKET_NAME'], 'models/car_scaler.joblib')

        return {'statusCode': 200, 'body': json.dumps("Data stored")}

    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"error": str(e)})
        }




