from repository.point_repository import PointRepository

class PointService:

    @staticmethod
    def award_points(user_id: int, amount: int, type: str, description: str):
        # amount → +10, -300 가능
        PointRepository.save_point_history(
            user_id=user_id,
            amount=amount,
            type=type,
            description=description
        )
