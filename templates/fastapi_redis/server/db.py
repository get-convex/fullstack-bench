import os

from redis import Redis

REDIS_HOST = os.getenv("REDIS_HOST") or 'localhost'
REDIS_PORT = os.getenv("REDIS_PORT") or '6379'
REDIS_DB = os.getenv("REDIS_DB") or '0'

redis_client = Redis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB)
