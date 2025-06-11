import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import Generator
import sys
import os
from unittest.mock import MagicMock

TEST_POSTGRESQL_URL = os.getenv("DATABASE_URL")

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, project_root)

from app.app import app, get_db
from app.models import Base, User
from app.auth import get_password_hash, create_access_token
from datetime import timedelta

SQLALCHEMY_DATABASE_URL_TEST = TEST_POSTGRESQL_URL

engine_test = create_engine(SQLALCHEMY_DATABASE_URL_TEST)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

Base.metadata.create_all(bind=engine_test)

@pytest.fixture(scope="function")
def db_session() -> Generator[sessionmaker, None, None]:
    Base.metadata.create_all(bind=engine_test)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine_test)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="module")
def client() -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="function")
def test_user(db_session):
    user_data = {"username": "testuser", "password": "testpassword"}
    user = User(
        username=user_data["username"],
        password_hash=get_password_hash(user_data["password"]),
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user_data

@pytest.fixture(scope="function")
def auth_token(test_user):
    access_token = create_access_token(
        data={"sub": test_user["username"]}, expires_delta=timedelta(minutes=30)
    )
    return access_token

@pytest.fixture(scope="function")
def auth_headers(auth_token):
    return {"Authorization": f"Bearer {auth_token}"}

@pytest.fixture(autouse=True, scope="session")
def mock_redis_globally(session_mocker):
    mock_client = MagicMock()
    mock_client.get.return_value = None
    mock_client.setex.return_value = True
    mock_client.delete.return_value = 1
    mock_client.keys.return_value = []
    session_mocker.patch("app.cache.redis_client", new=mock_client)
    return mock_client