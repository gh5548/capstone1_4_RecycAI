from fastapi import APIRouter, HTTPException
from dto.comment_dto import CommentCreateRequest
from service.comment_service import (
    create_comment_service,
    list_comments_service,
)

router = APIRouter(prefix="/posts/{post_id}/comments", tags=["comments"])


# 댓글 작성
@router.post("")
def create_comment(post_id: int, user_id: int, comment: CommentCreateRequest):
    try:
        comment_id = create_comment_service(post_id, user_id, comment.body)
        return {"message": "댓글 작성 성공", "comment_id": comment_id}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 댓글 목록
@router.get("")
def list_comments(post_id: int):
    try:
        comments = list_comments_service(post_id)
        return {"items": comments}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
