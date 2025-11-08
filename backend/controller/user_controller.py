from fastapi import APIRouter
from dto.user_dto import UserRegisterRequest
from service.user_service import register_user
from fastapi import HTTPException

router = APIRouter()

@router.post("/register")
def user_register(user: UserRegisterRequest):
    try:
        user_id = register_user(user.dict())
        return {"message": "회원가입 성공", "user_id": user_id}
    except HTTPException as e:
        raise e
    except Exception as e:
        # 예외 처리
        raise HTTPException(status_code=500, detail=str(e))
