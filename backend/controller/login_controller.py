from fastapi import APIRouter, HTTPException
from dto.login_dto import LoginRequest
from service.login_service import login_user

router = APIRouter()

@router.post("/login")
def login(request: LoginRequest):
    try:
        result = login_user(request.dict())
        return {
            "ok": True,
            "message": "로그인 성공",
            "user_id": result["user_id"],
            "nickname": result["nickname"],
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
