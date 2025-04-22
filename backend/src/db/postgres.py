import asyncpg

DATABASE_URL = "postgresql://postgres@localhost/testdb"

class Postgres:
    def __init__(self, database_url: str):
        self.database_url = database_url

    async def connect(self):
        self.pool = await asyncpg.create_pool(self.database_url)

    async def disconnect(self):
        await self.pool.close()

    async def create_tables(self):
        async with database.pool.acquire() as connection:
            await connection.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    uid TEXT PRIMARY KEY NOT NULL,
                    name TEXT NOT NULL,
                    email TEXT NOT NULL,
                    major TEXT,
                    year TEXT
                );

                CREATE TABLE IF NOT EXISTS plans (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    owner_uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
                    semester VARCHAR(15) NOT NULL,
                    name TEXT NOT NULL,
                    date DATE NOT NULL DEFAULT CURRENT_DATE
                );

                CREATE TABLE IF NOT EXISTS plan_classes (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    plan_id UUID REFERENCES plans(id) ON DELETE CASCADE,
                    code TEXT,
                    name TEXT,
                    reason TEXT,
                    prereqs TEXT[],
                    credits SMALLINT,
                    year TEXT,
                    semester TEXT
                );

                CREATE TABLE IF NOT EXISTS schedules (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    owner_uid TEXT REFERENCES users(uid) ON DELETE CASCADE,
                    semester VARCHAR(15) NOT NULL,
                    name TEXT NOT NULL,
                    date DATE NOT NULL DEFAULT CURRENT_DATE
                );

                CREATE TABLE IF NOT EXISTS schedule_classes (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    schedule_id UUID REFERENCES schedules(id) ON DELETE CASCADE,
                    code TEXT,
                    professor TEXT,
                    credits SMALLINT
                );

                CREATE TABLE IF NOT EXISTS class_meetings (
                    id SERIAL PRIMARY KEY,
                    schedule_class_id UUID NOT NULL REFERENCES schedule_classes(id) ON DELETE CASCADE,
                    location TEXT NOT NULL,
                    days TEXT NOT NULL,
                    start_period SMALLINT NOT NULL,
                    end_period SMALLINT NOT NULL
                );
                
                CREATE TABLE IF NOT EXISTS friendships (
                    id SERIAL PRIMARY KEY,
                    user_id TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
                    friend_id TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
                    pending boolean
                );
            ''')

database = Postgres(DATABASE_URL)