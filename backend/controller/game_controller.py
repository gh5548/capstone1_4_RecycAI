from fastapi import APIRouter
from dto.game_dto import GameScoreRequest
from service.game_service import GameService

router = APIRouter(prefix="/game")

@router.post("/score")
def record_game_score(req: GameScoreRequest):
    return GameService.record_score(req.user_id, req.score, req.game_type)
