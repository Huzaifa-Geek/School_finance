from fastapi import APIRouter

from app.database.connection import get_connection

router = APIRouter()


@router.get("/health")
def health_check():
    connection = get_connection()

    try:
        cursor = connection.execute("SELECT 1")
        result = cursor.fetchone()

        return {
            "status": "healthy",
            "database": "connected",
            "test": result[0],
        }

    finally:
        connection.close()