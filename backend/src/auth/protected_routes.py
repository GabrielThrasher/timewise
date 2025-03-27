from fastapi import APIRouter, Depends, HTTPException, Header
from src.auth.firebase import verify_firebase_token

router = APIRouter()

@router.get("/protected")
async def protected_route(authorization: str = Header(None)):
    """
    Example protected route that requires Firebase authentication.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")

    token = authorization.split("Bearer ")[1]

    try:
        user = verify_firebase_token(token)
        return {"message": "Access granted", "user": user}

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
