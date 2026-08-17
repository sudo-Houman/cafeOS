from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from app.db.databse import get_db 
from app.models.users import User
from app.schemas.users import UserCreate
from app.services.users import create_user

router = APIRouter(prefix="/users")

@router.post("/register")
def register(
    user:UserCreate,
    db: Session= Depends(get_db)) :
    return create_user(db,user) 