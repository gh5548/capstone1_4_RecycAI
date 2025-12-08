from config import get_connection
from datetime import date

class AttendanceRepository:

    @staticmethod
    def get_today_attendance(user_id: int):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM attendance
            WHERE user_id = %s AND attendance_date = CURDATE()
        """, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        conn.close()
        return result

    @staticmethod
    def save_attendance(user_id: int):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO attendance (user_id, attendance_date)
            VALUES (%s, CURDATE())
        """, (user_id,))
        cursor.close()
        conn.close()
