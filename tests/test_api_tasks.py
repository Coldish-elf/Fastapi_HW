from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models import Task, User
from app.schemas import TaskRead
import json
from datetime import timedelta

def create_task_direct(db: Session, owner_id: int, title: str, priority: int = 0, status: str = "в ожидании"):
    task = Task(title=title, owner_id=owner_id, priority=priority, status=status, description="")
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def test_create_task(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    user = db_session.query(User).filter(User.username == test_user["username"]).first()
    assert user is not None 

    task_data = {"title": "Test Task API", "description": "API desc", "status": "в работе", "priority": 5}
    response = client.post("/tasks", headers=auth_headers, json=task_data)
    
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == task_data["title"]
    assert data["description"] == task_data["description"]
    assert data["status"] == task_data["status"]
    assert data["priority"] == task_data["priority"]
    assert "id" in data
    assert "created_at" in data

    task_in_db = db_session.query(Task).filter(Task.id == data["id"]).first()
    assert task_in_db is not None
    assert task_in_db.owner_id == user.id

def test_read_tasks_empty(client: TestClient, auth_headers: dict):
    response = client.get("/tasks", headers=auth_headers)
    assert response.status_code == 200
    assert response.json() == []

def test_read_tasks_with_data(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    user = db_session.query(User).filter(User.username == test_user["username"]).first()
    
    task1_data = {"title": "Task Alpha", "description": "Desc A", "status": "в ожидании", "priority": 3}
    task2_data = {"title": "Task Beta", "description": "Desc B", "status": "в работе", "priority": 1}
    client.post("/tasks", headers=auth_headers, json=task1_data)
    client.post("/tasks", headers=auth_headers, json=task2_data)

    response = client.get("/tasks", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    titles = {task["title"] for task in tasks}
    assert "Task Alpha" in titles
    assert "Task Beta" in titles

def test_read_tasks_sorting(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    user = db_session.query(User).filter(User.username == test_user["username"]).first()
    db_session.query(Task).filter(Task.owner_id == user.id).delete()
    db_session.commit()

    client.post("/tasks", headers=auth_headers, json={"title": "C Task", "priority": 1, "status": "pending"})
    client.post("/tasks", headers=auth_headers, json={"title": "A Task", "priority": 3, "status": "done"})
    client.post("/tasks", headers=auth_headers, json={"title": "B Task", "priority": 2, "status": "in_progress"})

    response_title = client.get("/tasks?sort_by=title", headers=auth_headers)
    assert response_title.status_code == 200
    tasks_title = response_title.json()
    assert [task["title"] for task in tasks_title] == ["A Task", "B Task", "C Task"]

    response_status = client.get("/tasks?sort_by=status", headers=auth_headers)
    assert response_status.status_code == 200

def test_read_tasks_search(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    user = db_session.query(User).filter(User.username == test_user["username"]).first()
    db_session.query(Task).filter(Task.owner_id == user.id).delete()
    db_session.commit()

    client.post("/tasks", headers=auth_headers, json={"title": "Searchable Alpha", "description": "Unique keyword"})
    client.post("/tasks", headers=auth_headers, json={"title": "Another Task", "description": "Common text"})
    client.post("/tasks", headers=auth_headers, json={"title": "Specific Beta", "description": "Contains Alpha word"})

    response = client.get("/tasks?search=Alpha", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    assert any(t["title"] == "Searchable Alpha" for t in tasks)
    assert any(t["description"] == "Contains Alpha word" for t in tasks)

    response_unique = client.get("/tasks?search=Unique keyword", headers=auth_headers)
    assert response_unique.status_code == 200
    tasks_unique = response_unique.json()
    assert len(tasks_unique) == 1
    assert tasks_unique[0]["title"] == "Searchable Alpha"

def test_read_tasks_top_n(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    user = db_session.query(User).filter(User.username == test_user["username"]).first()
    db_session.query(Task).filter(Task.owner_id == user.id).delete()
    db_session.commit()

    client.post("/tasks", headers=auth_headers, json={"title": "P1", "priority": 1})
    client.post("/tasks", headers=auth_headers, json={"title": "P5", "priority": 5})
    client.post("/tasks", headers=auth_headers, json={"title": "P3", "priority": 3})
    client.post("/tasks", headers=auth_headers, json={"title": "P5_another", "priority": 5})


    response = client.get("/tasks?top=2", headers=auth_headers)
    assert response.status_code == 200
    tasks = response.json()
    assert len(tasks) == 2
    priorities = sorted([task["priority"] for task in tasks], reverse=True)
    assert priorities == [5, 5] 

def test_update_task(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    user = db_session.query(User).filter(User.username == test_user["username"]).first()
    task_orig_data = {"title": "Original Task", "description": "Original Desc", "status": "в ожидании", "priority": 1}
    create_response = client.post("/tasks", headers=auth_headers, json=task_orig_data)
    task_id = create_response.json()["id"]

    update_data = {"title": "Updated Task", "description": "Updated Desc", "status": "завершено", "priority": 10}
    response = client.put(f"/tasks/{task_id}", headers=auth_headers, json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["description"] == update_data["description"]
    assert data["status"] == update_data["status"]
    assert data["priority"] == update_data["priority"]
    assert data["id"] == task_id

    task_in_db = db_session.query(Task).filter(Task.id == task_id).first()
    assert task_in_db.title == update_data["title"]

def test_update_task_not_found(client: TestClient, auth_headers: dict):
    update_data = {"title": "Non Existent", "description": "...", "status": "...", "priority": 0}
    response = client.put("/tasks/99999", headers=auth_headers, json=update_data)
    assert response.status_code == 404

def test_update_task_forbidden(client: TestClient, db_session: Session, test_user, auth_headers):
    other_user_data = {"username": "otheruser", "password": "otherpassword"}
    client.post("/users", json=other_user_data)
    other_token_response = client.post("/token", data=other_user_data)
    other_auth_token = other_token_response.json()["access_token"]
    other_auth_headers = {"Authorization": f"Bearer {other_auth_token}"}

    other_task_response = client.post("/tasks", headers=other_auth_headers, json={"title": "Other's Task", "priority": 1})
    other_task_id = other_task_response.json()["id"]

    update_data = {"title": "Attempted Update", "description": "...", "status": "...", "priority": 0}
    response = client.put(f"/tasks/{other_task_id}", headers=auth_headers, json=update_data)
    assert response.status_code == 403

def test_delete_task(client: TestClient, auth_headers: dict, db_session: Session, test_user):
    task_data = {"title": "To Be Deleted", "priority": 1}
    create_response = client.post("/tasks", headers=auth_headers, json=task_data)
    task_id = create_response.json()["id"]

    response = client.delete(f"/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["detail"] == "Task deleted"

    task_in_db = db_session.query(Task).filter(Task.id == task_id).first()
    assert task_in_db is None

def test_delete_task_not_found(client: TestClient, auth_headers: dict):
    response = client.delete("/tasks/99999", headers=auth_headers)
    assert response.status_code == 404

def test_delete_task_forbidden(client: TestClient, db_session: Session, test_user, auth_headers):
    other_user_data = {"username": "deleter_otheruser", "password": "otherpassword"}
    client.post("/users", json=other_user_data)
    other_token_response = client.post("/token", data=other_user_data)
    other_auth_token = other_token_response.json()["access_token"]
    other_auth_headers = {"Authorization": f"Bearer {other_auth_token}"}

    other_task_response = client.post("/tasks", headers=other_auth_headers, json={"title": "Other's Task To Delete", "priority": 1})
    other_task_id = other_task_response.json()["id"]

    response = client.delete(f"/tasks/{other_task_id}", headers=auth_headers)
    assert response.status_code == 403


