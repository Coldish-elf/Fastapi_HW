from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models import User
from sqlalchemy.exc import IntegrityError
import pytest
from datetime import timedelta


def test_create_user(client: TestClient, db_session: Session):
    response = client.post(
        "/users",
        json={"username": "newuser", "password": "newpassword"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "newuser"
    assert "id" in data

    user_in_db = db_session.query(User).filter(User.username == "newuser").first()
    assert user_in_db is not None
    assert user_in_db.username == "newuser"


def test_create_user_duplicate_username(
    client: TestClient, test_user, db_session: Session
):
    response_duplicate = client.post(
        "/users",
        json={"username": test_user["username"], "password": "anotherpassword"},
    )
    assert response_duplicate.status_code == 409
    assert response_duplicate.json()["detail"] == "Username already exists"


def test_login_for_access_token(client: TestClient, test_user, db_session: Session):

    login_data = {"username": test_user["username"], "password": test_user["password"]}
    response = client.post("/token", data=login_data)

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client: TestClient, test_user, db_session: Session):
    login_data = {"username": test_user["username"], "password": "wrongpassword"}
    response = client.post("/token", data=login_data)
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid username or password"


def test_login_nonexistent_user(client: TestClient, db_session: Session):
    login_data = {"username": "nonexistentuser", "password": "password"}
    response = client.post("/token", data=login_data)
    assert response.status_code == 401
    data = response.json()
    assert data["detail"] == "Invalid username or password"
