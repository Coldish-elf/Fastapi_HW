from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime, timezone


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

    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    username: str
    password: str


class UserRead(BaseModel):
    id: int
    username: str

    model_config = ConfigDict(from_attributes=True)
