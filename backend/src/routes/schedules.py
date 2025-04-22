from fastapi import APIRouter, status, HTTPException
from src.routes.dependencies import AuthorizedUID
from src.db.schedules.schedules_model import ScheduleCreate, ScheduleEdit, ScheduleDelete, insert_schedule, edit_schedule, delete_schedule, get_schedule
from src.db.schedules.schedules_model import AddClassRequest, insert_class, delete_class
from src.routes.utils import get_semester_str
from src.semester_scheduling.semester_schedule import get_valid_semester_schedules
import requests
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/schedules"
)

class Filters(BaseModel):
    earliest_time: str
    latest_time: str 
    period_blackouts: List[str] 
    day_blackouts: List[str]
    min_instructor_rating: str
    max_level_of_difficulty: str
    min_would_take_again: str

class GenerateRequest(BaseModel):
    codes: List[str] 
    filters: Filters 

base_url = "https://one.uf.edu/apix/soc/schedule"
base_params = {
    "ai": "false",
    "auf": "false",
    "category": "CWSP",
    "class-num": "",
    "course-code": "COP3502",  # Replace with your desired course code
    "course-title": "",
    "cred-srch": "",
    "credits": "",
    "day-f": "",
    "day-m": "",
    "day-r": "",
    "day-s": "",
    "day-t": "",
    "day-w": "",
    "dept": "",
    "eep": "",
    "fitsSchedule": "false",
    "ge": "",
    "ge-b": "",
    "ge-c": "",
    "ge-d": "",
    "ge-h": "",
    "ge-m": "",
    "ge-n": "",
    "ge-p": "",
    "ge-s": "",
    "instructor": "",
    "last-control-number": "0",
    "level-max": "",
    "level-min": "",
    "no-open-seats": "false",
    "online-a": "",
    "online-c": "",
    "online-h": "",
    "online-p": "",
    "period-b": "",
    "period-e": "",
    "prog-level": "",
    "qst-1": "",
    "qst-2": "",
    "qst-3": "",
    "quest": "false",
    "term": "2258",  # Replace with the desired term
    "wr-2000": "",
    "wr-4000": "",
    "wr-6000": "",
    "writing": "false",
    "var-cred": "",
    "hons": "false",
}

@router.get("/search-course", status_code=status.HTTP_201_CREATED)
async def create(code: str, uid: AuthorizedUID):
    try:
        # https://one.uf.edu/apix/soc/schedule?ai=false&auf=false&category=CWSP&class-num=&course-code=${searchCourseCode}&course-title=&cred-srch=&credits=&day-f=&day-m=&day-r=&day-s=&day-t=&day-w=&dept=&eep=&fitsSchedule=false&ge=&ge-b=&ge-c=&ge-d=&ge-h=&ge-m=&ge-n=&ge-p=&ge-s=&instructor=&last-control-number=0&level-max=&level-min=&no-open-seats=false&online-a=&online-c=&online-h=&online-p=&period-b=&period-e=&prog-level=&qst-1=&qst-2=&qst-3=&quest=false&term=2258&wr-2000=&wr-4000=&wr-6000=&writing=false&var-cred=&hons=false
        params = base_params
        params["course-code"] = code
        # use async here
        response = requests.get(base_url, params=params)
        data = response.json()
        return data 
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error searching course")


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def create(schedule: ScheduleCreate, uid: AuthorizedUID):
    try:
        schedule.semester = get_semester_str(schedule.semester)
        await insert_schedule(schedule, uid)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error creating a schedule")

@router.get("/get", status_code=status.HTTP_200_OK)
async def get(id: str, uid: AuthorizedUID):
    try:
        return await get_schedule(id, uid)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error fetching the schedule")

@router.post("/edit", status_code=status.HTTP_200_OK)
async def edit(schedule: ScheduleEdit, uid: AuthorizedUID):
    try:
        schedule.semester = get_semester_str(schedule.semester)
        await edit_schedule(schedule, uid)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error editing schedule")
    
@router.post("/delete", status_code=status.HTTP_200_OK)
async def delete(schedule: ScheduleDelete, uid: AuthorizedUID):
    try:
        await delete_schedule(schedule, uid)
    except Exception:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error deleting schedule")

@router.post("/add-class", status_code=status.HTTP_200_OK)
async def add_class(req: AddClassRequest, uid: AuthorizedUID):
    try:
        return await insert_class(req.classToAdd, req.schedule_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.delete("/delete-class", status_code=status.HTTP_200_OK)
async def remove_class(classId: str, uid: AuthorizedUID):
    try:
        await delete_class(classId, uid)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)

@router.post("/generate", status_code=status.HTTP_200_OK)
async def generate(generateReq: GenerateRequest, uid: AuthorizedUID):
    try:
        return get_valid_semester_schedules(generateReq.codes, generateReq.filters)[:100]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=e)