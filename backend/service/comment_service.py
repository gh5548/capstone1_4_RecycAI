from fastapi import HTTPException
from repository.comment_repository import create_comment, list_comments_by_post_id
from repository.post_repository import get_post_by_id

def create_comment_service(post_id: int, user_id: int, body: str) -> int:
    # 게시글 존재 여부 확인
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")

    if not body or body.strip() == "":
        raise HTTPException(status_code=400, detail="댓글 내용을 입력해주세요.")

    comment_id = create_comment(post_id, user_id, body)
    return comment_id


def list_comments_service(post_id: int):
    # 게시글 존재 여부 확인(선택)
    post = get_post_by_id(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="게시글을 찾을 수 없습니다.")

    comments = list_comments_by_post_id(post_id)
    return comments
