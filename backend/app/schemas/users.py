from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    fullname: str  # اینجا fullname هست (نه full_name)
    role: str = "BARISTA"

class UserLogin(BaseModel):
    username: str
    password: str