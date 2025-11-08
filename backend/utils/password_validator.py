import re
from fastapi import HTTPException

def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="비밀번호는 최소 8자 이상이어야 합니다.")
    
    # 숫자 포함
    if not re.search(r"\d", password):
        raise HTTPException(status_code=400, detail="비밀번호에 숫자가 포함되어야 합니다.")
    
    # 영어 포함
    if not re.search(r"[A-Za-z]", password):
        raise HTTPException(status_code=400, detail="비밀번호에 영어가 포함되어야 합니다.")
    
    # 특수문자 포함
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        raise HTTPException(status_code=400, detail="비밀번호에 특수문자가 포함되어야 합니다.")
    
    # 공백 체크
    if re.search(r"\s", password):
        raise HTTPException(status_code=400, detail="비밀번호에 공백이 포함될 수 없습니다.")
    
    return True
