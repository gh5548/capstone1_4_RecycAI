import bcrypt
from fastapi import HTTPException
from repository.login_repository import get_user_for_login

def login_user(data: dict):
    email = data["email"]
    password = data["password"]

    user = get_user_for_login(email)
    if not user:
        raise HTTPException(status_code=401, detail="존재하지 않는 이메일입니다.")

    stored_pw = user["password"]

    # bcrypt 해시인 경우(보안때문에 bcrypt사용함)
    if isinstance(stored_pw, str) and stored_pw.startswith("$2b$"):
        if not bcrypt.checkpw(password.encode("utf-8"), stored_pw.encode("utf-8")):
            raise HTTPException(status_code=401, detail="비밀번호가 올바르지 않습니다.")
    else:
        if password != stored_pw:
            raise HTTPException(status_code=401, detail="비밀번호가 올바르지 않습니다.")

    # 로그인 성공: 필요한 최소 정보만 반환했음
    return {"user_id": user["user_id"], "nickname": user.get("nickname", "")}
