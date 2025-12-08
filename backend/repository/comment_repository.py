import mysql.connector
from config import get_connection

# 댓글 생성
def create_comment(post_id: int, user_id: int, body: str) -> int:
    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")

    sql = """
        INSERT INTO comment_tb (post_id, user_id, body, likes_count, created_at)
        VALUES (%s, %s, %s, 0, NOW())
    """
    values = (post_id, user_id, body)
    cursor.execute(sql, values)
    conn.commit()
    comment_id = cursor.lastrowid

    cursor.close()
    conn.close()
    return comment_id


# 특정 게시글의 댓글 목록
def list_comments_by_post_id(post_id: int):
    conn = mysql.connector.connect(**get_connection)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SET NAMES utf8mb4")

    sql = """
        SELECT 
            c.comment_id,
            c.post_id,
            c.user_id,
            c.body,
            c.likes_count,
            c.created_at,
            u.nickname
        FROM comment_tb c
        JOIN user_tb u ON c.user_id = u.user_id
        WHERE c.post_id = %s
        ORDER BY c.created_at ASC
    """
    cursor.execute(sql, (post_id,))
    comments = cursor.fetchall()

    cursor.close()
    conn.close()
    return comments
