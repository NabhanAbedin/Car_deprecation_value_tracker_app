from dotenv import load_dotenv
import os
import psycopg2
import pandas as pd
import uuid
import ast


def insert_to_db(): 
    load_dotenv()

    db_url = os.environ["DATABASE_URL"]

    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()

    df = pd.read_csv("final_car_vectors.csv")

    df["FuelType"] = df.apply(lambda r: "Petrol" if r["FuelType_Petrol"] == 1 else "Diesel", axis=1)
    df["Transmission"] = df.apply(lambda r: "MANUAL" if r["Transmission_MANUAL"] == 1 else "AUTOMATIC", axis=1)

    for _, row in df.iterrows():
        vector = ast.literal_eval(row["FeaturesVector"])

        cursor.execute("""
            INSERT INTO "MarketData"
            ("Id","Brand","Model", "Year", "ConditionScore", "Kilometers","SoldPrice", "Age", "Transmission", "FuelType", "Owner", "FeaturesVector")
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                       """, (
                        str(uuid.uuid4()),
                        row["Brand"],
                        row["Model"],
                        int(row["Year"]),
                        int(row["ConditionScore"]),
                        int(row["Kilometers"]),
                        int(row["SoldPrice"]),
                        int(row["Age"]),
                        row["Transmission"], 
                        row["FuelType"],     
                        row["Owner"],
                        str(vector)   
                       ))
        
    conn.commit()
    cursor.close()
    conn.close()


if __name__ == '__main__':
    insert_to_db()