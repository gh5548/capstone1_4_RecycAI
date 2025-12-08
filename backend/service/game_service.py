from repository.game_repository import GameRepository
from service.point_service import PointService

class GameService:

    @staticmethod
    def record_score(user_id: int, score: int, game_type: str):

        # 1) 점수 저장
        GameRepository.save_game_score(user_id, score, game_type)

        # 2) 포인트 지급
        PointService.award_points(
            user_id=user_id,
            amount=score,
            type="GAME",
            description=f"{game_type} 게임 포인트 지급"
        )

        return {"success": True, "message": f"게임 완료! 포인트 +{score}"}
