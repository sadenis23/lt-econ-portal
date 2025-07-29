from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db import init_db
from .routes import reports, users, datasets, dashboards

app = FastAPI()

# Add CORS middleware for frontend-backend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(reports.router)
app.include_router(users.router)
app.include_router(datasets.router)
app.include_router(dashboards.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lithuanian Economics Portal API!"} 