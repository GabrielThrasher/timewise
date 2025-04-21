from .schedules_schema import ScheduleCreate, ScheduleEdit, ScheduleDelete
from src.db.postgres import database

async def insert_schedule(schedule: ScheduleCreate, uid: str):
    query = "INSERT INTO schedules (owner_uid, name, semester) VALUES ($1, $2, $3)"
    async with database.pool.acquire() as connection:
        await connection.execute(query, uid, schedule.name, schedule.semester)

async def edit_schedule(schedule: ScheduleEdit, uid: str):
    query = "UPDATE schedules SET name = $1, semester = $2 WHERE id = $3 AND owner_uid = $4"
    async with database.pool.acquire() as connection:
        await connection.execute(query, schedule.name, schedule.semester, schedule.id, uid)

async def delete_schedule(schedule: ScheduleDelete, uid: str):
    query = "DELETE FROM schedules WHERE id = $1 AND owner_uid = $2"
    async with database.pool.acquire() as connection:
        await connection.execute(query, schedule.id, uid)

async def get_schedule_by_uid(user_id: str):
    query = "SELECT * FROM schedules WHERE owner_uid = $1"
    async with database.pool.acquire() as connection:
        return await connection.fetch(query, user_id)
