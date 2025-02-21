import json
import os
from datetime import datetime, timedelta, timezone

import jwt
from db import redis_client
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from pydantic import BaseModel
from typing_extensions import Annotated

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY") or "SECRET_KEY=b5d0ac473d321a1c0c0ed2b7b6ebfd7d167bd1693f6a54f4fbc9c5d9d6657b09"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str

class User(BaseModel):
    id: str
    email: str

class UserInDB(User):
    hashed_password: str

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_user_by_email(email: str):
    row = await redis_client.get(f'user:{email}')
    if not row:
        return None
    user_dict = json.loads(row)
    return UserInDB(**user_dict)

async def get_user_by_id(user_id: str):
    email = await redis_client.get(f'user_by_id:{user_id}')
    if not email:
        return None
    return await get_user_by_email(email)

async def insert_user(email: str, password: str):
    user_id = str(await redis_client.incr('next_user_id'))
    user_dict = {
        "id": user_id,
        "email": email,
        "hashed_password": get_password_hash(password)
    }
    await redis_client.setnx(f'user:{email}', json.dumps(user_dict))
    await redis_client.setnx(f'user_by_id:{user_id}', email)
    return UserInDB(**user_dict)

async def authenticate_user(email: str, password: str):
    user = await get_user_by_email(email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def issue_access_token(user: User):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data = {"sub": user.email}
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + access_token_expires
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return Token(access_token=encoded_jwt, token_type="bearer")

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except InvalidTokenError:
        raise credentials_exception
    user = await get_user_by_email(email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
