from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from src.db.postgres import database
from src.routes.auth.register import router as auth_router
from src.routes.plans import router as plans_router
from src.routes.overview import router as overview_router 
from src.routes.schedules import router as schedules_router
from src.routes import friends


@asynccontextmanager
async def lifespan(app: FastAPI):
    await database.connect()
    await database.create_tables()
    yield
    await database.disconnect()

app = FastAPI(lifespan=lifespan)

origins = [
    # "http://localhost:5173"
    # "http://10.138.32.73:5173"
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(plans_router, prefix="/api")
app.include_router(schedules_router, prefix="/api")
app.include_router(overview_router, prefix="/api")
app.include_router(friends.router, prefix="/api")

@app.get("/")
async def root():
    return "Timewise API"
