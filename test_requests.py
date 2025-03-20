import requests
import json

BASE_URL = "http://localhost:8000"

def test_create_user():
    response = requests.post(
        f"{BASE_URL}/users",
        json={"username": "testuser", "password": "testpassword"}
    )
    print("Create user response:", response.status_code, response.json())
    return response.json()

def test_login(username="testuser", password="testpassword"):
    response = requests.post(
        f"{BASE_URL}/token",
        data={"username": username, "password": password}
    )
    print("Login response:", response.status_code, response.json())
    return response.json().get("access_token")

def test_create_task(token):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(
        f"{BASE_URL}/tasks",
        headers=headers,
        json={
            "title": "Test Task",
            "description": "This is a test task",
            "status": "в ожидании",
            "priority": 5
        }
    )
    print("Create task response:", response.status_code, response.json())
    return response.json()

def test_get_tasks(token, params=None):
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        f"{BASE_URL}/tasks",
        headers=headers,
        params=params
    )
    print("Get tasks response:", response.status_code, response.json())
    return response.json()

def run_tests():
    user = test_create_user()
    token = test_login()
    task1 = test_create_task(token)
    
    task2 = requests.post(
        f"{BASE_URL}/tasks",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "High Priority Task",
            "description": "This is a high priority task",
            "status": "в работе",
            "priority": 10
        }
    ).json()
    
    task3 = requests.post(
        f"{BASE_URL}/tasks",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Low Priority Task",
            "description": "This is a low priority task",
            "status": "завершено",
            "priority": 1
        }
    ).json()
    
    all_tasks = test_get_tasks(token)
    sorted_by_title = test_get_tasks(token, {"sort_by": "title"})
    sorted_by_status = test_get_tasks(token, {"sort_by": "status"})
    search_results = test_get_tasks(token, {"search": "high"})
    top_tasks = test_get_tasks(token, {"top": 2})
    task_id = task1["id"]
    update_response = requests.put(
        f"{BASE_URL}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Updated Task",
            "description": "This task has been updated",
            "status": "завершено",
            "priority": 7
        }
    )
    print("Update task response:", update_response.status_code, update_response.json())
    delete_response = requests.delete(
        f"{BASE_URL}/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    print("Delete task response:", delete_response.status_code, delete_response.json())

if __name__ == "__main__":
    run_tests()
