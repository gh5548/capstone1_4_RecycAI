import mysql.connector
from fastapi import HTTPException
from config import get_connection

# 게시글 생성
def create_post(user_id: int, data: dict) -> int:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")

    sql = """
        INSERT INTO post_tb (user_id, title, content, image_url, create_at, update_at, like_count, view_count)
        VALUES (%s, %s, %s, %s, NOW(), NOW(), 0, 0)
    """
    values = (
        user_id,
        data["title"],
        data["content"],
        data.get("image_url"),
    )
    cursor.execute(sql, values)
    conn.commit()
    post_id = cursor.lastrowid

    cursor.close()
    conn.close()
    return post_id

def create_post_service(user_id: int, data: dict) -> int:
    if not data.get("title"):
        raise HTTPException(status_code=400, detail="제목은 필수입니다.")
    if not data.get("content"):
        raise HTTPException(status_code=400, detail="내용은 필수입니다.")
    return create_post(user_id, data)

# 게시글 단건 조회 (작성자 닉네임 포함)
def get_post_by_id(post_id: int):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SET NAMES utf8mb4")

    sql = """
        SELECT 
            p.post_id,
            p.user_id,
            p.title,
            p.content,
            p.image_url,
            p.create_at,
            p.update_at,
            p.like_count,
            p.view_count,
            u.nickname
        FROM post_tb p
        JOIN user_tb u ON p.user_id = u.user_id
        WHERE p.post_id = %s
    """
    cursor.execute(sql, (post_id,))
    post = cursor.fetchone()

    cursor.close()
    conn.close()
    return post


# 게시글 리스트 조회 (페이지네이션)
def list_posts(offset: int = 0, limit: int = 10):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SET NAMES utf8mb4")

    sql = """
        SELECT 
            p.post_id,
            p.user_id,
            p.content,
            p.title,
            p.image_url,
            p.create_at,
            p.update_at,
            p.like_count,
            p.view_count,
            u.nickname
        FROM post_tb p
        JOIN user_tb u ON p.user_id = u.user_id
        ORDER BY p.create_at DESC
        LIMIT %s OFFSET %s
    """
    cursor.execute(sql, (limit, offset))
    posts = cursor.fetchall()

    cursor.close()
    conn.close()
    return posts


# 게시글 수정 (본인 글인지까지 여기서 체크해도 되고, 서비스에서 체크해도 됨)
def update_post(post_id: int, user_id: int, data: dict) -> int:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")

    # 본인 글인지 확인
    cursor.execute(
        "SELECT user_id FROM post_tb WHERE post_id = %s",
        (post_id,)
    )
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return 0  # 없는 글
    owner_id = row[0]
    if owner_id != user_id:
        cursor.close()
        conn.close()
        return -1  # 권한 없음

    fields = []
    values = []
    if data.get("title") is not None:
        fields.append("title = %s")
        values.append(data["title"])
    if data.get("content") is not None:
        fields.append("content = %s")
        values.append(data["content"])
    if data.get("image_url") is not None:
        fields.append("image_url = %s")
        values.append(data["image_url"])

    if not fields:
        cursor.close()
        conn.close()
        return 1  # 변경사항 없음

    fields.append("update_at = NOW()")

    sql = f"UPDATE post_tb SET {', '.join(fields)} WHERE post_id = %s"
    values.append(post_id)

    cursor.execute(sql, tuple(values))
    conn.commit()
    rowcount = cursor.rowcount

    cursor.close()
    conn.close()
    return rowcount


# 게시글 삭제
def delete_post(post_id: int, user_id: int) -> int:
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")

    # 본인 글인지 확인
    cursor.execute(
        "SELECT user_id FROM post_tb WHERE post_id = %s",
        (post_id,)
    )
    row = cursor.fetchone()
    if not row:
        cursor.close()
        conn.close()
        return 0  # 없는 글
    owner_id = row[0]
    if owner_id != user_id:
        cursor.close()
        conn.close()
        return -1  # 권한 없음

    cursor.execute("DELETE FROM post_tb WHERE post_id = %s", (post_id,))
    conn.commit()
    rowcount = cursor.rowcount

    cursor.close()
    conn.close()
    return rowcount


# 조회수 +1
def increase_view_count(post_id: int):
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()
    cursor.execute("SET NAMES utf8mb4")

    cursor.execute(
        "UPDATE post_tb SET view_count = view_count + 1 WHERE post_id = %s",
        (post_id,)
    )
    conn.commit()

    cursor.close()
    conn.close()
