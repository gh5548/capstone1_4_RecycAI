from repository.user_repository import get_user_by_email, create_user
from fastapi import HTTPException
from utils.password_validator import validate_password  # utils 폴더에 만든 파일 import

def register_user(user_data):
    # 1️⃣ 비밀번호 검증
    validate_password(user_data['password'])
    
    # 2️⃣ 이메일 중복 체크
    if get_user_by_email(user_data['email']):
        raise HTTPException(status_code=400, detail="이미 사용중인 이메일입니다.")

    # 3️⃣ 계정 생성
    user_id = create_user(user_data)
    return user_id
