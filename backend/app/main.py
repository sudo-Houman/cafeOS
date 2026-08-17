from fastapi import FastAPI 
from app.routers.auth import router as user_router
import uvicorn

app = FastAPI(title="Cafe-OS")

app.include_router(user_router)

@app.get("/")
def read_root():
    return {"message": "Cafe-System API online"} 


if __name__ == "__main__" :
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
