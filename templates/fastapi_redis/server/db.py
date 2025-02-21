import os

import aioredis

REDIS_HOST = os.getenv("REDIS_HOST") or 'localhost'
REDIS_PORT = os.getenv("REDIS_PORT") or '6379'
REDIS_DB = os.getenv("REDIS_DB") or '0'

redis_client = aioredis.from_url(f'redis://{REDIS_HOST}:{REDIS_PORT}/{REDIS_DB}', decode_responses=True)

