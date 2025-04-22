from fastapi import  HTTPException, Header, status
from typing import Annotated
from pydantic import BaseModel
from src.firebase import verify_firebase_token
from src.db.users.users_model import insert_user, User, get_user
from src.routes.auth import router
from src.routes.dependencies import AuthorizedUID

class AccountInfo(BaseModel):
    name: str
    major: str
    year: str

@router.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(account: AccountInfo, authorization: Annotated[str, Header()]):
    """
    - Receives Firebase ID token in Authorization header (Bearer token)
    - Verifies token and stores user in PostgreSQL if new
    - Returns user info
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authorization header missing or invalid")

    token = authorization.split("Bearer ")[1]

    try:
        decoded_user = verify_firebase_token(token)
        uid = decoded_user["uid"]
        email = decoded_user.get("email")

        await insert_user(User(uid=uid, email=email, name=account.name, major=account.major, year=account.year))

    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Firebase token")

@router.get("/auth/get-user", status_code=status.HTTP_200_OK)
async def get(uid: AuthorizedUID):
    try:
        return await get_user(uid)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="error")