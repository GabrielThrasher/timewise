from pydantic import BaseModel

class User(BaseModel):
    uid: str
    name: str
    email: str
    username: str