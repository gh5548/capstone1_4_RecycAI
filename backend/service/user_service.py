from repository.user_repository import (
    get_user_by_email,
    create_user,
    get_user_by_id,
    get_recent_posts_by_user,
    get_point,
    redeem_point
)
from fastapi import HTTPException
from utils.password_validator import validate_password  # utils 폴더에 만든 파일 import


def register_user(user_data):
    # 비밀번호 검증
    validate_password(user_data['password'])
    
    # 이메일 중복 체크
    if get_user_by_email(user_data['email']):
        raise HTTPException(status_code=400, detail="이미 사용중인 이메일입니다.")

    # 계정 생성
    user_id = create_user(user_data)
    return user_id


# 마이페이지용 프로필 정보 조회
def get_user_profile(user_id: int):
    # 기본 사용자 정보 조회
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    # 최근 게시글 5개 가져오기
    posts = get_recent_posts_by_user(user_id, limit=5)

    # 내용 일부만 잘라서 보여주기 (길이 제한)
    def truncate(text, length=30):
        if not text:
            return ""
        return text[:length] + ("…" if len(text) > length else "")

    recent_posts = []
    for post in posts:
        recent_posts.append({
            "post_id": post.get("post_id"),
            "title": truncate(post.get("content")),
            "created_at": post.get("create_at").strftime("%Y-%m-%d %H:%M")
                          if post.get("create_at") else None,
            "likes": post.get("like_count", 0),
            "views": post.get("view_count", 0)
        })

    # 반환 데이터
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "nickname": user["nickname"],
        "point": user["point"],
        "joined_at": user["created_at"].strftime("%Y-%m-%d")
                     if user["created_at"] else None,
        "last_login": user["last_login"].strftime("%Y-%m-%d %H:%M")
                      if user["last_login"] else None,
        "recent_posts": recent_posts
    }


# 포인트 조회
def get_user_point(user_id: int) -> int:
    return get_point(user_id)


# 아이템 교환
def redeem_item(user_id: int, price: int) -> None:
    ok = redeem_point(user_id, price)
    if not ok:
        raise HTTPException(status_code=400, detail="포인트가 부족합니다.")
