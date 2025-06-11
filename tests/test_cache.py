import pytest
import json
from datetime import datetime, timezone
import redis

from app.cache import (
    generate_cache_key,
    get_cached_tasks,
    set_cached_tasks,
    invalidate_user_cache,
    CACHE_TTL,
)
import app.cache as cache_module_to_patch
from app.schemas import TaskRead

_test_redis_client = None


@pytest.fixture(autouse=True)
def managed_redis_client(monkeypatch):
    global _test_redis_client

    _test_redis_client = redis.Redis(
        host="redis", port=6379, db=0, decode_responses=True
    )

    try:
        _test_redis_client.ping()
    except redis.exceptions.ConnectionError as e:
        pytest.fail(f"Cannot connect to test Redis at host 'redis': {e}")

    monkeypatch.setattr(cache_module_to_patch, "redis_client", _test_redis_client)

    _test_redis_client.flushdb()

    yield


def test_generate_cache_key():
    key1 = generate_cache_key("user1")
    assert key1 == "tasks:user1:sort=None:search=None:top=None"

    key2 = generate_cache_key("user2", sort_by="title", search="keyword", top=5)
    assert key2 == "tasks:user2:sort=title:search=keyword:top=5"

    key3 = generate_cache_key("user3", sort_by="status")
    assert key3 == "tasks:user3:sort=status:search=None:top=None"


def test_get_cached_tasks_hit():
    global _test_redis_client
    cache_key = "test_key_hit_real_redis"
    task_created_at = datetime.now(timezone.utc)
    task_obj = TaskRead(
        id=1,
        title="Test Task",
        description="Desc",
        status="done",
        created_at=task_created_at,
        priority=1,
    )
    task_data_dict = task_obj.model_dump(mode="json")

    _test_redis_client.set(cache_key, json.dumps([task_data_dict]))

    try:
        result = get_cached_tasks(cache_key)

        assert result is not None
        assert len(result) == 1
        retrieved_task = result[0]
        assert retrieved_task["title"] == "Test Task"
        assert retrieved_task["created_at"] == task_data_dict["created_at"]
        assert retrieved_task["id"] == task_obj.id
    finally:
        _test_redis_client.delete(cache_key)


def test_get_cached_tasks_miss():
    global _test_redis_client
    cache_key = "test_key_miss_real_redis"
    _test_redis_client.delete(cache_key)

    result = get_cached_tasks(cache_key)

    assert result is None


def test_set_cached_tasks():
    global _test_redis_client
    cache_key = "test_set_key_real_redis"
    _test_redis_client.delete(cache_key)

    tasks_to_cache = [
        TaskRead(
            id=1,
            title="Task 1",
            description="Desc 1",
            status="pending",
            created_at=datetime.now(timezone.utc),
            priority=1,
        ),
        TaskRead(
            id=2,
            title="Task 2",
            description="Desc 2",
            status="done",
            created_at=datetime.now(timezone.utc),
            priority=2,
        ),
    ]

    expected_tasks_data = [task.model_dump(mode="json") for task in tasks_to_cache]

    try:
        set_cached_tasks(cache_key, tasks_to_cache)

        cached_data_json = _test_redis_client.get(cache_key)
        assert cached_data_json is not None

        cached_data = json.loads(cached_data_json)
        assert cached_data == expected_tasks_data

        ttl = _test_redis_client.ttl(cache_key)
        assert ttl > 0
        assert ttl <= CACHE_TTL
    finally:
        _test_redis_client.delete(cache_key)


def test_invalidate_user_cache_with_keys():
    global _test_redis_client
    username = "user_to_invalidate_real"
    key1 = f"tasks:{username}:key1_real"
    key2 = f"tasks:{username}:key2_real"
    other_user_key = "tasks:other_user_real:key3"

    _test_redis_client.delete(key1, key2, other_user_key)
    _test_redis_client.set(key1, "data1")
    _test_redis_client.set(key2, "data2")
    _test_redis_client.set(other_user_key, "data3")

    try:
        invalidate_user_cache(username)

        assert _test_redis_client.get(key1) is None
        assert _test_redis_client.get(key2) is None
        assert _test_redis_client.get(other_user_key) is not None
    finally:
        _test_redis_client.delete(other_user_key)


def test_invalidate_user_cache_no_keys():
    global _test_redis_client
    username = "user_with_no_cache_real"
    pattern = f"tasks:{username}:*"

    existing_keys = _test_redis_client.keys(pattern)
    if existing_keys:
        _test_redis_client.delete(*existing_keys)

    invalidate_user_cache(username)

    assert _test_redis_client.keys(pattern) == []
