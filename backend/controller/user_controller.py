from fastapi import APIRouter, HTTPException, Query
from dto.user_dto import UserRegisterRequest
from service.user_service import register_user, get_user_profile

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

# 마이페이지용 사용자 정보 조회
@router.get("/me")
def user_profile(user_id: int = Query(..., description="localStorage의 userId 전달")):
    try:
        profile = get_user_profile(user_id)
        return profile
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
