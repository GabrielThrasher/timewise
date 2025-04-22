from fastapi import APIRouter, status, HTTPException
from src.routes.dependencies import AuthorizedUID
from src.db.plans.plans_model import PlanCreate, PlanEdit, PlanDelete, insert_plan, edit_plan, delete_plan, insert_class, AddPlanClassReq, get_plan, delete_class
from src.routes.utils import get_semester_str
from src.db.postgres import database
import os
import json

router = APIRouter(
    prefix="/plans"
)

@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(plan: PlanCreate, uid: AuthorizedUID):
    try:
        # TODO: i don't think this is best practice
        plan.semester = get_semester_str(plan.semester)
        await insert_plan(plan, uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating a 4-year plan")

@router.post("/edit", status_code=status.HTTP_200_OK)
async def edit(plan: PlanEdit, uid: AuthorizedUID):
    try:
        plan.semester = get_semester_str(plan.semester)
        await edit_plan(plan, uid)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error editing 4-year plan")
    
@router.post("/delete", status_code=status.HTTP_200_OK)
async def delete(plan: PlanDelete, uid: AuthorizedUID):
    try:
        await delete_plan(plan, uid)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting 4-year plan")

@router.get("/get-semester-model", status_code=status.HTTP_201_CREATED)
async def get_model(major: str, uid: AuthorizedUID):
    try:
        with open("../data/"+major+".json", "r") as file:
            data = json.load(file)
            return data
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.get("/search", status_code=status.HTTP_201_CREATED)
async def search(code: str, uid: AuthorizedUID):
    try:
        query = '''
            SELECT *
            FROM Courses
            WHERE code ILIKE '%' || $1 || '%';
        '''
        async with database.pool.acquire() as connection:
            return await connection.fetch(query, code)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.get("/get", status_code=status.HTTP_200_OK)
async def get(id: str, uid: AuthorizedUID):
    try:
        return await get_plan(id, uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.post("/add-class", status_code=status.HTTP_200_OK)
async def add_class(req: AddPlanClassReq, uid: AuthorizedUID):
    try:
        return await insert_class(req.classToAdd, req.plan_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.delete("/delete-class", status_code=status.HTTP_200_OK)
async def remove_class(classId: str, uid: AuthorizedUID):
    try:
        await delete_class(classId, uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)