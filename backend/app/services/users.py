from sqlalchemy.orm import Session
from app.models.users import User 
from app.schemas.users import UserCreate

def create_user(db: Session,user: UserCreate): 
     
     new_user =User(
        username= user.username,
        password= user.password,
        fullname= user.fullname,
        role= user.role
     )
     db.add(new_user)
     db.commit()
     db.refresh(new_user)
     return new_user
