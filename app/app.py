from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from contextlib import asynccontextmanager

from app.database import SessionLocal, engine
from app.models import Base, Task, User
from app.schemas import TaskCreate, TaskRead, UserCreate, UserRead
from app.auth import (
    create_access_token,
    get_password_hash,
    verify_password,
    get_current_user,
)
from app.cache import (
    get_cached_tasks,
    set_cached_tasks,
    generate_cache_key,
    invalidate_user_cache,
)


@asynccontextmanager
async def startup_event(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(lifespan=startup_event)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/users", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(
        username=user.username, password_hash=get_password_hash(user.password)
    )
    db.add(db_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username already exists"
        )
    db.refresh(db_user)
    return db_user


@app.post("/token")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    access_token = create_access_token({"sub": user.username}, timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/tasks", response_model=TaskRead)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_user),
):
    owner = (
        db.query(User).filter(User.username == username).first() if username else None
    )
    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        owner=owner,
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    if username:
        invalidate_user_cache(username)
    return db_task


@app.get("/tasks", response_model=List[TaskRead])
def read_tasks(
    sort_by: Optional[str] = None,
    search: Optional[str] = None,
    top: Optional[int] = None,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_user),
):
    cache_key = generate_cache_key(username, sort_by, search, top)
    cached_result = get_cached_tasks(cache_key)

    if cached_result:
        return [TaskRead(**task) for task in cached_result]

    query = db.query(Task)
    owner = (
        db.query(User).filter(User.username == username).first() if username else None
    )
    if owner:
        query = query.filter(Task.owner_id == owner.id)
    if search:
        search_str = f"%{search}%"
        query = query.filter(
            (Task.title.like(search_str)) | (Task.description.like(search_str))
        )
    if sort_by in ["title", "status", "created_at"]:
        query = query.order_by(getattr(Task, sort_by))
    if top is not None:
        query = query.order_by(Task.priority.desc()).limit(top)

    db_tasks_result = query.all()

    pydantic_tasks = [
        TaskRead.model_validate(db_task_item) for db_task_item in db_tasks_result
    ]

    set_cached_tasks(cache_key, pydantic_tasks)
    return pydantic_tasks


@app.put("/tasks/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    update_data: TaskCreate,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_user),
):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    owner = db.query(User).filter(User.username == username).first()
    if db_task.owner_id and db_task.owner_id != owner.id:
        raise HTTPException(status_code=403)
    db_task.title = update_data.title
    db_task.description = update_data.description
    db_task.status = update_data.status
    db_task.priority = update_data.priority
    db.commit()
    db.refresh(db_task)
    if username:
        invalidate_user_cache(username)
    return db_task


@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    username: str = Depends(get_current_user),
):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    owner = db.query(User).filter(User.username == username).first()
    if db_task.owner_id and db_task.owner_id != owner.id:
        raise HTTPException(status_code=403)
    db.delete(db_task)
    db.commit()
    if username:
        invalidate_user_cache(username)
    return {"detail": "Task deleted"}


@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI app"}
