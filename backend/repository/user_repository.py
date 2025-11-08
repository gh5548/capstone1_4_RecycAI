import mysql.connector
from config import DB_CONFIG
from datetime import datetime

def get_user_by_email(email: str):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM user_tb WHERE email=%s AND deleted_at='9999-12-31 23:59:59'", 
        (email,)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user

def create_user(user: dict):
    import bcrypt

    # 비밀번호 해싱
    hashed_pw = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt())

    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    sql = """
        INSERT INTO user_tb 
        (email, password, name, nickname, phone, profile_image, point, created_at, deleted_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        user['email'],
        hashed_pw.decode('utf-8'),
        user['name'],
        user['nickname'],
        user.get('phone'),
        user.get('profile_image'),
        0,
        datetime.now(),
        "9999-12-31 23:59:59"
    )
    cursor.execute(sql, values)
    conn.commit()
    user_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return user_id
