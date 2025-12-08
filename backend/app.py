from fastapi import FastAPI
from backend.controller.user_controller import router as user_router
from backend.controller.shop_controller import router as shop_router

from backend.controller.attendance_controller import router as attendance_router
from backend.controller.game_controller import router as game_router
app = FastAPI()

app.include_router(user_router, prefix="/user")
app.include_router(shop_router, prefix="/shop")
app.include_router(attendance_router)
app.include_router(game_router)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
