from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "в ожидании"
    priority: Optional[int] = 0

class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    created_at: datetime
    priority: int
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    class Config:
        orm_mode = True
