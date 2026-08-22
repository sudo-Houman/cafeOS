from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth import router as user_router
from app.db.database import engine, Base
import uvicorn

# ایجاد جدول‌ها
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cafe-OS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IMPORTANT: مسیرها نسبت به فایل main.py هست
app.mount("/frontend/statics", StaticFiles(directory="../frontend/statics"), name="statics")
templates = Jinja2Templates(directory="../frontend/templates")

app.include_router(user_router)

@app.get("/")
def read_root(request: Request):
    return templates.TemplateResponse("auth/auth.html", {"request": request})

@app.get("/health")
def health():
    return {"message": "Cafe-System API online"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )