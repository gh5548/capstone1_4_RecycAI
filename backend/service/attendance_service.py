from repository.attendance_repository import AttendanceRepository
from service.point_service import PointService

class AttendanceService:

    @staticmethod
    def check_attendance(user_id: int):

        # 오늘 이미 출석했는지 확인
        existing = AttendanceRepository.get_today_attendance(user_id)
        if existing:
            return {"success": False, "message": "이미 출석했습니다."}

        # 출석 INSERT
        AttendanceRepository.save_attendance(user_id)

        # 포인트 지급
        PointService.award_points(
            user_id=user_id,
            amount=10,
            type="ATTENDANCE",
            description="출석체크 포인트 지급"
        )

        return {"success": True, "message": "출석 완료! 포인트 +10"}
