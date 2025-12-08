from fastapi import APIRouter
from dto.attendance_dto import AttendanceRequest
from service.attendance_service import AttendanceService

router = APIRouter(prefix="/attendance")

@router.post("/check")
def check_attendance(req: AttendanceRequest):
    return AttendanceService.check_attendance(req.user_id)
