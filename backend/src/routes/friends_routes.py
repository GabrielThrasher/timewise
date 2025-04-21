from fastapi import APIRouter, Depends, HTTPException
from src.firebase import verify_firebase_token
from src.db.users.friendship_model import insert_friendship, list_friendships, get_user_by_uid
from src.db.schedules.schedules_model import get_schedule_by_uid

router = APIRouter()

@router.get("/friends/search/{uid}")
async def search_user(uid: str):
    user = await get_user_by_uid(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"uid": user["uid"], "email": user["email"]}

@router.post("/friends/add/{friend_uid}")
async def add_friend(friend_uid: str, user=Depends(verify_firebase_token)):
    if friend_uid == user["uid"]:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    friend = await get_user_by_uid(friend_uid)
    if not friend:
        raise HTTPException(status_code=404, detail="Friend not found")

    await insert_friendship(user["uid"], friend_uid)
    return {"message": f"Added {friend_uid} as a friend."}

@router.get("/friends/list")
async def list_friends(user=Depends(verify_firebase_token)):
    friendships = await list_friendships(user["uid"])
    return [{"friend_id": f["friend_id"]} for f in friendships]

@router.get("/friends/{friend_uid}/schedule")
async def get_friend_schedule(friend_uid: str, user=Depends(verify_firebase_token)):
    if friend_uid == user["uid"]:
        raise HTTPException(status_code=400, detail="Use your own schedule route.")

    friendships = await list_friendships(user["uid"])
    friend_ids = [f["friend_id"] for f in friendships]

    if friend_uid not in friend_ids:
        raise HTTPException(status_code=403, detail="You are not friends with this user.")

    schedule = await get_schedule_by_uid(friend_uid)
    return [dict(row) for row in schedule]
