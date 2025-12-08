from pydantic import BaseModel

class GameScoreRequest(BaseModel):
    user_id: int
    score: int
    game_type: str
