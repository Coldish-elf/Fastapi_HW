import pytest
from fastapi import HTTPException, status
from jose import jwt
from datetime import datetime, timezone, timedelta

from app.auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    SECRET_KEY,
    ALGORITHM,
    oauth2_scheme
)

def test_password_hashing_and_verification():
    password = "securepassword123"
    hashed_password = get_password_hash(password)
    assert hashed_password != password
    assert verify_password(password, hashed_password)
    assert not verify_password("wrongpassword", hashed_password)

def test_create_access_token():
    data = {"sub": "testuser"}
    token = create_access_token(data.copy())
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload["sub"] == "testuser"
    assert "exp" in payload

def test_create_access_token_with_expiry():
    data = {"sub": "testuser_expiry"}
    expires_delta = timedelta(minutes=15)
    token = create_access_token(data.copy(), expires_delta=expires_delta)
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert payload["sub"] == "testuser_expiry"
    expiration_time = datetime.fromtimestamp(payload["exp"], timezone.utc)
    assert expiration_time > datetime.now(timezone.utc)  
    assert expiration_time < datetime.now(timezone.utc) + expires_delta + timedelta(seconds=1)  

def test_get_current_user_valid_token():
    username = "testuser_token"
    token_data = {"sub": username, "exp": datetime.now(timezone.utc) + timedelta(minutes=5)}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    current_user = get_current_user(token=token)
    assert current_user == username

def test_get_current_user_expired_token():
    username = "testuser_expired"
    token_data = {"sub": username, "exp": datetime.now(timezone.utc) - timedelta(minutes=5)}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token)
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_current_user_no_sub():
    token_data = {"exp": datetime.now(timezone.utc) + timedelta(minutes=5)}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token)
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED

def test_get_current_user_invalid_token():
    invalid_token = "this.is.not.a.valid.token"
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=invalid_token)
    assert exc_info.value.status_code == status.HTTP_401_UNAUTHORIZED
