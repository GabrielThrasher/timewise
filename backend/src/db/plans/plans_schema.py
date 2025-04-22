from pydantic import BaseModel
from typing import List

class PlanBase(BaseModel):
    id: str

class PlanCreate(BaseModel):
    name: str
    semester: str

class PlanEdit(PlanBase):
    name: str
    semester: str

class PlanDelete(PlanBase):
    pass

class PlanClassCreate(BaseModel):
    code: str
    name: str
    reason: str
    prereqs: List[str]
    credits: int 
    year: str
    semester: str

class AddPlanClassReq(BaseModel):
    classToAdd: PlanClassCreate
    plan_id: str