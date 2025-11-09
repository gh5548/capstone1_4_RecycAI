# 이건 fastapi 서버를 실행하기 위한 전용 실행 스크립트입니다 필요하면 고쳐 쓰십숑 어떤 역할 하는진 대충 주석으로 적어놨습니당
import os, sys

# 경로 설정
BASE_DIR = os.path.dirname(os.path.abspath(__file__))      
BACKEND_DIR = os.path.join(BASE_DIR, "backend")            

# dto / repository / controller 를 최상위처럼 임포트 가능하게
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# FastAPI / 앱 불러오기
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app import app

# 로그인 라우터 주입
from controller.login_controller import router as login_router
app.include_router(login_router, prefix="/auth")

APP_STRING = "backend.app:app"

# 프론트가 있는 실제 디렉터리 
FRONT_DIR = BASE_DIR
print(f"[run_server] FRONT_DIR = {FRONT_DIR} (exists: {os.path.exists(FRONT_DIR)})")

app.mount("/", StaticFiles(directory=FRONT_DIR, html=True), name="front")

# 확장자 없이 /login, /mypage 로 접근할 때 파일 직접 반환
@app.get("/login")
def login_page():
    path = os.path.join(FRONT_DIR, "login.html")
    if os.path.exists(path):
        return FileResponse(path)
    return FileResponse(os.path.join(FRONT_DIR, "index.html"))

@app.get("/mypage")
def mypage():
    path = os.path.join(FRONT_DIR, "mypage.html")
    if os.path.exists(path):
        return FileResponse(path)
    return FileResponse(os.path.join(FRONT_DIR, "index.html"))

# 실행 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(APP_STRING, host="127.0.0.1", port=8000, reload=True)
