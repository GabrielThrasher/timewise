from fastapi import APIRouter, status, HTTPException
from pydantic import BaseModel
from src.routes.dependencies import AuthorizedUID
from src.db.users.friendship_model import insert_friendship, get_friendships, get_user_by_name, accept_request, get_requests, get_friend_info

router = APIRouter()

class AddFriendRequest(BaseModel):
    friend_uid: str

@router.get("/friends/search")
async def search_user(name: str, uid: AuthorizedUID):
    try:
        user = await get_user_by_name(name)
        return user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.get("/friends/requests")
async def get_pending_requests(uid: AuthorizedUID):
    try:
        return await get_requests(uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.post("/friends/accept")
async def accept_pending_requests(req: AddFriendRequest, uid: AuthorizedUID):
    try:
        await accept_request(uid, req.friend_uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.get("/friends/get")
async def get_friends(uid: AuthorizedUID):
    try:
        return await get_friendships(uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.post("/friends/add")
async def add_friend(req: AddFriendRequest, uid: AuthorizedUID):
    if req.friend_uid == uid:
        raise HTTPException(status_code=400, detail="Cannot add yourself")

    # friend = await get_user_by_uid(friend_uid)
    # if not friend:
    #     raise HTTPException(status_code=404, detail="Friend not found")

    await insert_friendship(req.friend_uid, uid)
    # return {"message": f"Added {req.friend_uid} as a friend."}

@router.get("/friends/get-info")
async def get_info(friend_uid: str, uid: AuthorizedUID):
    try:
        return await get_friend_info(friend_uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

# @router.get("/friends/list")
# async def list_friends(user=Depends(verify_firebase_token)):
#     friendships = await list_friendships(user["uid"])
#     return [{"friend_id": f["friend_id"]} for f in friendships]

# @router.get("/friends/{friend_uid}/schedule")
# async def get_friend_schedule(friend_uid: str, user=Depends(verify_firebase_token)):
#     if friend_uid == user["uid"]:
#         raise HTTPException(status_code=400, detail="Use your own schedule route.")

#     friendships = await list_friendships(user["uid"])
#     friend_ids = [f["friend_id"] for f in friendships]

#     if friend_uid not in friend_ids:
#         raise HTTPException(status_code=403, detail="You are not friends with this user.")

#     schedule = await get_schedule_by_uid(friend_uid)
#     return [dict(row) for row in schedule]
