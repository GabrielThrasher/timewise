from src.auth.auth_routes import router as auth_router
# from src.auth.protected_routes import router as protected_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.db.postgres import database


@asynccontextmanager
async def lifespan(app: FastAPI):
     await database.connect()
     yield
     await database.disconnect()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
# app.include_router(protected_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to Timewise API"}
