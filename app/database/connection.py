import os

import libsql
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    database_url = os.getenv("TURSO_DATABASE_URL")
    auth_token = os.getenv("TURSO_AUTH_TOKEN")

    if not database_url:
        raise ValueError("TURSO_DATABASE_URL is not set in the environment.")

    if not auth_token:
        raise ValueError("TURSO_AUTH_TOKEN is not set in the environment.")

    connection = libsql.connect(
        "school_finance.db",
        sync_url=database_url,
        auth_token=auth_token,
    )

    return connection