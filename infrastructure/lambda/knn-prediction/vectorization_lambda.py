import json
import joblib
import boto3
import io
import os
import pandas as pd
from datetime import datetime


s3 = boto3.client('s3')


def load_scalar():
    bucket = os.environ['S3_BUCKET_NAME']
    key = 'models/car_scaler.joblib'

    response = s3.get_object(Bucket=bucket, Key=key)
    scaler_bytes = response['Body'].read()
    return joblib.load(io.BytesIO(scaler_bytes))


def event_handler(event, context):
    try:
        brand = event.get('InputBrand')
        model = event.get('InputModel')
        year = int(event.get('InputYear'))
        condition = int(event.get('InputConditionScore'))
        kilometers = int(event.get('InputKilometers'))
        fuel_type = event.get('InputFuelType', '').upper()
        transmission = event.get('InputTransmission', '').upper()

        if transmission != 'MANUAL' and transmission != 'AUTOMATIC':
            transmission = "AUTOMATIC"

        current_year = datetime.now().year
        age = current_year - year

        is_petrol = 1 if 'PETROL' in fuel_type else 0
        is_diesel = 1 if 'DIESEL' in fuel_type else 0

        is_manual = 1 if 'MANUAL' in transmission else 0
        is_automatic = 1 if 'AUTOMATIC' in transmission else 0

        scalar = load_scalar()

        numerical_features = [[age, kilometers, condition, 1]]
        scaled_nums = scalar.transform(numerical_features)[0]

        final_vector = [float(x) for x in scaled_nums] + [is_petrol, is_diesel, is_manual, is_automatic]

        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'vector': final_vector
            })
        }
    
    except Exception as e:
       return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
