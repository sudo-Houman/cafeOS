from sqlalchemy.orm import Session
from app.models.users import User 
from app.schemas.users import UserCreate
from fastapi import HTTPException, status

def create_user(db: Session, user: UserCreate):
    exist_user = db.query(User).filter(User.username == user.username).first()
    if exist_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exist !!!"
        )

    new_user = User(
        username=user.username,
        password=user.password,
        fullname=user.fullname,  # اینجا fullname هست
        role=user.role if user.role else "BARISTA"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User registered successfully"}

def login_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    
    if not user or user.password != password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    return {"message": "Login successful"}