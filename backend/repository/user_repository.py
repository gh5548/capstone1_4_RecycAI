import mysql.connector
from config import get_connection
from datetime import datetime

def get_user_by_email(email: str):
    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SET NAMES utf8mb4")  # utf8mb4: db로 옮길때 한글 자꾸 깨져서 추가했습니다
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

    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")
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


# 로그인 성공 시 최근 로그인 시간 갱신
def update_last_login(user_id: int):
    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor()
    cursor.execute("UPDATE user_tb SET last_login = NOW() WHERE user_id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

# 마이페이지용 사용자 정보 조회
def get_user_by_id(user_id: int):
    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SET NAMES utf8mb4")
    cursor.execute("""
        SELECT user_id, email, nickname, point, created_at, last_login
        FROM user_tb
        WHERE user_id = %s
          AND deleted_at = '9999-12-31 23:59:59'
        LIMIT 1
    """, (user_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()
    return row

# 마이페이지용 최근 활동 조회
def get_recent_posts_by_user(user_id: int, limit: int = 5):
    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SET NAMES utf8mb4")
    cursor.execute("""
        SELECT post_id, content, create_at, like_count, view_count
        FROM post_tb
        WHERE user_id = %s
        ORDER BY create_at DESC
        LIMIT %s
    """, (user_id, limit))
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

# 현재 포인트 조회
def get_point(user_id: int) -> int:
    conn = mysql.connector.connect(**get_connection)
    cur = conn.cursor()
    cur.execute("SELECT point FROM user_tb WHERE user_id=%s AND deleted_at='9999-12-31 23:59:59'", (user_id,))
    row = cur.fetchone()
    cur.close()
    conn.close()
    return int(row[0]) if row else 0

# 포인트 차감
def redeem_point(user_id: int, price: int) -> bool:
    conn = mysql.connector.connect(**get_connection)
    cur = conn.cursor()
    try:
        # 포인트가 충분한 경우에만 차감
        cur.execute(
            "UPDATE user_tb SET point = point - %s WHERE user_id=%s AND point >= %s",
            (price, user_id, price)
        )
        conn.commit()
        return cur.rowcount == 1
    finally:
        cur.close()
        conn.close()
