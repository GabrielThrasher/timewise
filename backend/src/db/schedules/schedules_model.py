from .schedules_schema import ScheduleCreate, ScheduleEdit, ScheduleDelete, ScheduleClassCreate, AddClassRequest
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

async def get_schedule(id: str, uid: str):
    query = "SELECT * FROM schedules JOIN schedule_classes ON schedules.id = schedule_id JOIN class_meetings ON schedule_class_id = schedule_classes.id WHERE schedules.id = $1"

    async with database.pool.acquire() as connection:
        data = await connection.fetch(query, id)
        return data

async def insert_class(classToAdd: ScheduleClassCreate, schedule_id: str):
    query = "INSERT INTO schedule_classes (schedule_id, code, professor, credits) VALUES ($1, $2, $3, $4) RETURNING id"
    query2 = "INSERT INTO class_meetings (schedule_class_id, location, days, start_period, end_period) VALUES ($1, $2, $3, $4, $5)"
    async with database.pool.acquire() as connection:
        async with connection.transaction():
            # Execute the first query and get the returned ID
            schedule_class_id = await connection.fetchval(
                query, schedule_id, classToAdd.code, classToAdd.professor, classToAdd.credits
            )

            # Use the returned ID in the second query
            for meeting in classToAdd.meeting_times:
                await connection.execute(
                    query2,
                    schedule_class_id,
                    meeting.location,
                    meeting.days,
                    meeting.start_period,
                    meeting.end_period,
                )
            
            return schedule_class_id

async def delete_class(classId: str, uid: str):
    query = "DELETE FROM schedule_classes USING schedules WHERE schedule_classes.id = $1 AND schedule_classes.schedule_id = schedules.id AND schedules.owner_uid = $2"
    async with database.pool.acquire() as connection:
        await connection.execute(query, classId, uid)