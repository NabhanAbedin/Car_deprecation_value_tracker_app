import json
import joblib
import sys
from datetime import datetime
import os

def load_scaler(path="data/models/scaler.joblib"):
   base = os.path.dirname(os.path.abspath(__file__))
   return joblib.load(os.path.join(base, "/Users/nabhanabedin/Desktop/Car_deprecation_value_tracker_app/scaler"))

def get_vector(event):
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

    scaler = load_scaler()

    numerical_features = [[age, kilometers, condition, 1]]
    scaled_nums = scaler.transform(numerical_features)[0]

    final_vector = [float(x) for x in scaled_nums] + [is_petrol, is_diesel, is_manual, is_automatic]

    return final_vector

if __name__ == "__main__":
    event = json.loads(sys.stdin.read())
    vector = get_vector(event)
    print(json.dumps({'vector': vector}))
