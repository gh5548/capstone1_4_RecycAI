import mysql.connector
from config import DB_CONFIG

def get_user_for_login(email: str):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT user_id, email, password, nickname FROM user_tb "
        "WHERE email=%s AND deleted_at='9999-12-31 23:59:59' LIMIT 1",
        (email,)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user
