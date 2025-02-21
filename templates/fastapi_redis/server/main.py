
from auth import (
    Token,
    User,
    authenticate_user,
    get_current_user,
    insert_user,
    issue_access_token,
)
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from typing_extensions import Annotated

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_methods=['GET', 'POST'],
    allow_headers=['*'],
    allow_credentials=True,
)

@app.post("/auth/signup")
async def signup(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]) -> Token:
    user = await insert_user(form_data.username, form_data.password)
    return issue_access_token(user)

@app.post("/auth/login")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> Token:
    email = form_data.username
    user = await authenticate_user(email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = issue_access_token(user)
    return token

@app.get("/auth/current_user", response_model=User)
async def current_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    return current_user