from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base,engine

class User(Base) :

    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    username = Column(String(20),unique=True,index=True)
    password = Column(String)
    fullname = Column(String)
    role = Column(String,default="BARISTA")
    is_active = Column(Boolean,default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

Base.metadata.create_all(engine)