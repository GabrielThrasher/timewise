from src.db.postgres import database

async def insert_friendship(friend_uid: str, uid: str):
    query = """
        INSERT INTO friendships (user_id, friend_id, pending)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
    """
    async with database.pool.acquire() as connection:
        await connection.execute(query, uid, friend_uid, True)

async def get_requests(user_id: str):
    query = '''SELECT friendships.*, users.name, users.uid
                FROM friendships
                JOIN users ON friendships.user_id = users.uid
                WHERE friendships.friend_id = $1 AND friendships.pending = true
            '''
    async with database.pool.acquire() as connection:
        return await connection.fetch(query, user_id)

async def accept_request(user_id: str, friend_id: str):
    query = '''UPDATE friendships
                SET pending = false
                WHERE user_id = $2 AND friend_id = $1;
            '''

    query2 = """
        INSERT INTO friendships (user_id, friend_id, pending)
        VALUES ($2, $1, $3)
        ON CONFLICT DO NOTHING;
    """
    async with database.pool.acquire() as connection:
        await connection.execute(query2, friend_id, user_id, False)
        return await connection.fetch(query, user_id, friend_id)

async def get_friendships(user_id: str):
    query = '''SELECT friendships.*, users.name, users.uid
                FROM friendships
                JOIN users ON friendships.user_id = users.uid
                WHERE friendships.friend_id = $1 AND friendships.pending = false 
            '''
    async with database.pool.acquire() as connection:
        return await connection.fetch(query, user_id)

async def get_user_by_name(name: str):
    query = '''
            SELECT *
            FROM users
            WHERE name ILIKE '%' || $1 || '%';
        '''
    async with database.pool.acquire() as connection:
            return await connection.fetch(query, name)

async def get_friend_info(friend_uid: str):
    info_query = '''
        SELECT *
        FROM users
        WHERE uid = $1;
    '''
    plan_query = '''
        SELECT * FROM plans where owner_uid = $1
    '''
    schedule_query = '''
        SELECT * FROM schedules where owner_uid = $1
    '''
    plan_classes_query = '''
        SELECT *
        FROM plan_classes
        WHERE plan_id = $1;
    '''
    schedule_classes_query = '''
        SELECT * FROM schedules JOIN schedule_classes ON schedules.id = schedule_id 
        JOIN class_meetings ON schedule_class_id = schedule_classes.id WHERE schedules.id = $1 
        AND schedules.owner_uid = $2
    '''
    info = {}
    async with database.pool.acquire() as connection:
        user = await connection.fetch(info_query, friend_uid)
        info["user"] = user

        if user is None or user == []: return

        plan = await connection.fetchrow(plan_query, friend_uid)

        if plan is not None:
            info["plan"] = {
                "id": plan["id"],
            } 

        schedule = await connection.fetchrow(schedule_query, friend_uid)

        if schedule is not None:
            info["schedule"] = {
                "id": schedule["id"],
            } 

        return info

