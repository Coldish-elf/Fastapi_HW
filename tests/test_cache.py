import pytest
import json
from unittest.mock import MagicMock
from datetime import datetime, timezone

from app.cache import (
    generate_cache_key,
    get_cached_tasks,
    set_cached_tasks,
    invalidate_user_cache,
    CACHE_TTL,
    redis_client as app_redis_client 
)
from app.schemas import TaskRead

@pytest.fixture
def mock_redis_client_for_cache_tests(mocker):
    mock_client = MagicMock()
    mock_client.get.return_value = None
    mock_client.setex.return_value = True
    mock_client.delete.return_value = 1
    mock_client.keys.return_value = []
    mocker.patch('app.cache.redis_client', mock_client)
    return mock_client

def test_generate_cache_key():
    key1 = generate_cache_key("user1")
    assert key1 == "tasks:user1:sort=None:search=None:top=None"

    key2 = generate_cache_key("user2", sort_by="title", search="keyword", top=5)
    assert key2 == "tasks:user2:sort=title:search=keyword:top=5"

    key3 = generate_cache_key("user3", sort_by="status")
    assert key3 == "tasks:user3:sort=status:search=None:top=None"

def test_get_cached_tasks_hit(mock_redis_client_for_cache_tests):
    cache_key = "test_key_hit"
    task_obj = TaskRead(id=1, title="Test Task", description="Desc", status="done", created_at=datetime.now(timezone.utc), priority=1)
    task_data_dict = task_obj.model_dump(mode='json') 
    
    mock_redis_client_for_cache_tests.get.return_value = json.dumps([task_data_dict])
    
    result = get_cached_tasks(cache_key)
    
    mock_redis_client_for_cache_tests.get.assert_called_once_with(cache_key)
    assert result is not None
    assert len(result) == 1
    assert result[0]["title"] == "Test Task"
    assert result[0]["created_at"] == task_data_dict["created_at"]


def test_get_cached_tasks_miss(mock_redis_client_for_cache_tests):
    cache_key = "test_key_miss"
    mock_redis_client_for_cache_tests.get.return_value = None 
    
    result = get_cached_tasks(cache_key)
    
    mock_redis_client_for_cache_tests.get.assert_called_once_with(cache_key)
    assert result is None

def test_set_cached_tasks(mock_redis_client_for_cache_tests):
    cache_key = "test_set_key"
    tasks_to_cache = [
        TaskRead(id=1, title="Task 1", description="Desc 1", status="pending", created_at=datetime.now(timezone.utc), priority=1),
TaskRead(id=2, title="Task 2", description="Desc 2", status="done", created_at=datetime.now(timezone.utc), priority=2), 
    ]
    
    expected_tasks_data = [task.model_dump(mode='json') for task in tasks_to_cache]
    expected_json_data = json.dumps(expected_tasks_data)
    
    set_cached_tasks(cache_key, tasks_to_cache)
    
    mock_redis_client_for_cache_tests.setex.assert_called_once_with(cache_key, CACHE_TTL, expected_json_data)

def test_invalidate_user_cache_with_keys(mock_redis_client_for_cache_tests):
    username = "user_to_invalidate"
    pattern = f"tasks:{username}:*"
    keys_found = [f"tasks:{username}:key1", f"tasks:{username}:key2"]
    
    mock_redis_client_for_cache_tests.keys.return_value = keys_found
    
    invalidate_user_cache(username)
    
    mock_redis_client_for_cache_tests.keys.assert_called_once_with(pattern)
    mock_redis_client_for_cache_tests.delete.assert_called_once_with(*keys_found)

def test_invalidate_user_cache_no_keys(mock_redis_client_for_cache_tests):
    username = "user_with_no_cache"
    pattern = f"tasks:{username}:*"
    
    mock_redis_client_for_cache_tests.keys.return_value = [] 
    
    invalidate_user_cache(username)
    
    mock_redis_client_for_cache_tests.keys.assert_called_once_with(pattern)
    mock_redis_client_for_cache_tests.delete.assert_not_called()

