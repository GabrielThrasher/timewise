from .plans_schema import PlanCreate, PlanEdit, PlanDelete, PlanClassCreate, AddPlanClassReq
from src.db.postgres import database

async def insert_plan(plan: PlanCreate, uid: str):
    query = "INSERT INTO plans (owner_uid, name, semester) VALUES ($1, $2, $3)"
    async with database.pool.acquire() as connection:
        await connection.execute(query, uid, plan.name, plan.semester)

async def edit_plan(plan: PlanEdit, uid: str):
    query = "UPDATE plans SET name = $1, semester = $2 WHERE id = $3 AND owner_uid = $4"
    async with database.pool.acquire() as connection:
        await connection.execute(query, plan.name, plan.semester, plan.id, uid)

async def delete_plan(plan: PlanDelete, uid: str):
    query = "DELETE FROM plans WHERE id = $1 AND owner_uid = $2"
    async with database.pool.acquire() as connection:
        await connection.execute(query, plan.id, uid)

async def get_plan(id: str, uid: str):
    query = "SELECT * FROM plans JOIN plan_classes ON plans.id = plan_id WHERE plans.id = $1"

    async with database.pool.acquire() as connection:
        data = await connection.fetch(query, id)
        return data

async def delete_class(classId: str, uid: str):
    query = "DELETE FROM plan_classes USING plans WHERE plan_classes.id = $1 AND plan_classes.plan_id = plans.id AND plans.owner_uid = $2"
    async with database.pool.acquire() as connection:
        await connection.execute(query, classId, uid)

async def insert_class(classToAdd: PlanClassCreate, plan_id: str):
    query = "INSERT INTO plan_classes (plan_id, code, name, reason, prereqs, credits, year, semester) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id"
    async with database.pool.acquire() as connection:
        return await connection.fetchval(
            query,
            plan_id,
            classToAdd.code,
            classToAdd.name,
            classToAdd.reason,
            classToAdd.prereqs,
            classToAdd.credits,
            classToAdd.year,
            classToAdd.semester
        )
            
