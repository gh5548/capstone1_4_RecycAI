from config import get_connection

class PointRepository:

    @staticmethod
    def save_point_history(user_id: int, amount: int, type: str, description: str):

        conn = get_connection()
        cursor = conn.cursor()

        try:
            # 1) point_history INSERT
            cursor.execute("""
                INSERT INTO point_history (user_id, amount, type, description)
                VALUES (%s, %s, %s, %s)
            """, (user_id, amount, type, description))

            # 2) user_tb 포인트 업데이트 (+ 또는 -)
            cursor.execute("""
                UPDATE user_tb
                SET point = point + %s
                WHERE user_id = %s
            """, (amount, user_id))

        finally:
            cursor.close()
            conn.close()
