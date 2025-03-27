from .users_schema import User
from src.db.postgres import database

async def insert_user(user: User):
    query = "INSERT INTO users (uid, name, email, username) VALUES ($1, $2, $3, $4)"
    async with database.pool.acquire() as connection:
        await connection.execute(query, user.uid, user.name, user.email, user.username)