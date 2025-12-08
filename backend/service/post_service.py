from fastapi import HTTPException
from repository.post_repository import (
    create_post,
    get_post_by_id,
    list_posts,
    update_post,
    delete_post,
    increase_view_count,
)
from repository.comment_repository import list_comments_by_post_id

def create_post_service(user_id: int, data: dict) -> int:
    # 제목 필수
    if not data.get("title"):
        raise HTTPException(status_code=400, detail="제목은 필수입니다.")

    # 내용 필수
    if not data.get("content"):
        raise HTTPException(status_code=400, detail="내용은 필수입니다.")

    # ""로 들어온 image_url은 None으로 바꿔서 -> DB에 NULL 저장되게
    image_url = data.get("image_url")
    if image_url == "":
        data["image_url"] = None

    post_id = create_post(user_id, data)
    return post_id


def list_posts_service(page: int = 1, size: int = 10):
    if page < 1:
        page = 1
    offset = (page - 1) * size
    posts = list_posts(offset=offset, limit=size)
    return posts


def get_post_detail_service(post_id: int):
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")

    # 조회수 증가
    increase_view_count(post_id)

    # 다시 읽어오거나, post["view_count"]만 +1 해도 됨
    post["view_count"] = post.get("view_count", 0) + 1

    # 댓글 목록 추가
    comments = list_comments_by_post_id(post_id)
    post["comments"] = comments

    return post


def update_post_service(post_id: int, user_id: int, data: dict):
    result = update_post(post_id, user_id, data)
    if result == 0:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    if result == -1:
        raise HTTPException(status_code=403, detail="본인이 작성한 글만 수정할 수 있습니다.")
    return True


def delete_post_service(post_id: int, user_id: int):
    result = delete_post(post_id, user_id)
    if result == 0:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")
    if result == -1:
        raise HTTPException(status_code=403, detail="본인이 작성한 글만 삭제할 수 있습니다.")
    return True
