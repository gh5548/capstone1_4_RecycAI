from pydantic import BaseModel

class AttendanceRequest(BaseModel):
    user_id: int
