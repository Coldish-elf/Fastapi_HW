import redis
import json
from typing import Optional, List
from app.schemas import TaskRead

redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)
CACHE_TTL = 300  

def generate_cache_key(username: str, sort_by: Optional[str] = None, search: Optional[str] = None, top: Optional[int] = None) -> str:
    return f"tasks:{username}:sort={sort_by}:search={search}:top={top}"

def get_cached_tasks(cache_key: str) -> Optional[List[dict]]:
    cached_data = redis_client.get(cache_key)
    if cached_data:
        return json.loads(cached_data)
    return None

def set_cached_tasks(cache_key: str, tasks: List[TaskRead]):
    tasks_data = [task.model_dump(mode='json') for task in tasks]  
    redis_client.setex(cache_key, CACHE_TTL, json.dumps(tasks_data))

def invalidate_user_cache(username: str):
    pattern = f"tasks:{username}:*"
    keys = redis_client.keys(pattern)
    if keys:
        redis_client.delete(*keys)
