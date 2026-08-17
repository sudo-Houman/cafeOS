from pydantic import BaseModel

class UserCreate(BaseModel) :

    username: str
    password: str
    fullname:str
    role: str = "BARISTA"

class UserLogin(BaseModel) :

    username: str
    password: str
    
