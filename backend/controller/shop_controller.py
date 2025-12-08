# controller/shop_controller.py
from fastapi import APIRouter, HTTPException, Query
from service.user_service import get_user_point, redeem_item

router = APIRouter(tags=["shop"])

@router.get("/point")
def read_point(user_id: int = Query(..., description="현재 로그인한 사용자 ID")):
    try:
        return {"point": get_user_point(user_id)}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/redeem")
def redeem(
    user_id: int = Query(..., description="사용자 ID"),
    price: int = Query(..., gt=0, description="차감할 포인트"),
    item_name: str = Query("", description="아이템 이름(선택)")
):
    try:
        redeem_item(user_id, price)
        return {"message": "교환 완료", "price": price, "item_name": item_name}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))