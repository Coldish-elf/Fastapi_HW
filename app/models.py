from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="в ожидании")
    created_at = Column(DateTime, default=datetime.utcnow)
    priority = Column(Integer, default=0)
    # Optional user linkage
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User")
