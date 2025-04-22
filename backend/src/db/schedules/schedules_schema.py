from pydantic import BaseModel
from typing import List

class ScheduleBase(BaseModel):
    id: str

class ScheduleCreate(BaseModel):
    name: str
    semester: str

class ScheduleEdit(ScheduleBase):
    name: str
    semester: str

class ScheduleDelete(ScheduleBase):
    pass

class MeetingTime(BaseModel):
    days: str
    location: str
    start_period: int
    end_period: int 

class ScheduleClassCreate(BaseModel):
    code: str
    professor: str
    credits: int
    meeting_times: List[MeetingTime]

class AddClassRequest(BaseModel):
    classToAdd: ScheduleClassCreate
    schedule_id: str