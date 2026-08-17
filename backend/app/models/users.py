from sqlalchemy import Column,Integer,String,Boolean
from app.db.databse import Base,engine

class User(Base) :

    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    username = Column(String(20),unique=True,index=True)
    password = Column(String)
    fullname = Column(String)
    role = Column(String,default="BARISTA")
    is_active = Column(Boolean,default=True)

Base.metadata.create_all(engine)