from config import get_connection

class GameRepository:

    @staticmethod
    def save_game_score(user_id: int, score: int, game_type: str):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO game_score (user_id, score, game_type, created_at)
            VALUES (%s, %s, %s, NOW())
        """, (user_id, score, game_type))
        cursor.close()
        conn.close()
