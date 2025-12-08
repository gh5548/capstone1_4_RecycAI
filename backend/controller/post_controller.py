from fastapi import APIRouter, HTTPException
from dto.post_dto import PostCreateRequest, PostUpdateRequest
from service.post_service import (
    create_post_service,
    list_posts_service,
    get_post_detail_service,
    update_post_service,
    delete_post_service,
)

router = APIRouter(prefix="/posts", tags=["posts"])


# 게시글 작성
@router.post("")
def create_post(user_id: int, post: PostCreateRequest):
    try:
        post_id = create_post_service(user_id, post.dict())
        return {"message": "게시글 작성 성공", "post_id": post_id}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# 게시글 목록
@router.get("")
def list_posts(page: int = 1, size: int = 10):
    try:
        posts = list_posts_service(page=page, size=size)
        return {"items": posts, "page": page, "size": size}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 게시글 상세
@router.get("/{post_id}")
def get_post_detail(post_id: int):
    try:
        post = get_post_detail_service(post_id)
        return post
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 게시글 수정
@router.put("/{post_id}")
def update_post(post_id: int, user_id: int, post: PostUpdateRequest):
    try:
        update_post_service(post_id, user_id, post.dict())
        return {"message": "게시글 수정 성공"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 게시글 삭제
@router.delete("/{post_id}")
def delete_post(post_id: int, user_id: int):
    try:
        delete_post_service(post_id, user_id)
        return {"message": "게시글 삭제 성공"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
