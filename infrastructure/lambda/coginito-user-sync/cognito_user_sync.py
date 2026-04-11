import json
import os
import psycopg2
from datetime import datetime, timezone


def handler(event,context):

    user_id = event['request']['userAttributes']['sub']
    email = event['request']['userAttributes']['email']
    created_at = datetime.now(timezone.utc)

    conn = psycopg2.connect(
        host = os.environ['DB_HOST'],
        port = os.environ.get('DB_PORT',5432),
        dbname = os.environ['DB_NAME'],
        password = os.environ['DB_PASSWORD']
    )

    try: 
        with conn.cursor() as cur:
            cur.execute(
                'INSERT INTO "User" ("Id","Email","created_at") VALUES (%s, %s,%s)', (user_id, email, created_at)
            )
        conn.commit()
    finally:
        conn.close()

    return event