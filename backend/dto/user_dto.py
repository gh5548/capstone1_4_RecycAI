from pydantic import BaseModel
from typing import Optional

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    name: str
    nickname: str
    phone: Optional[str] = None
    profile_image: Optional[str] = None
