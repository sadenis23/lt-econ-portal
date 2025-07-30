import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from .db import init_db
from .routes import reports, users, datasets, dashboards, profiles

app = FastAPI(
    title="Lithuanian Economics Portal API",
    description="Secure API for Lithuanian economic data and analytics",
    version="1.0.0"
)

# Security middleware
if os.getenv("ENVIRONMENT") == "production":
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["yourdomain.com", "www.yourdomain.com"]
    )

# Add CORS middleware for frontend-backend integration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(reports.router)
app.include_router(users.router)
app.include_router(datasets.router)
app.include_router(dashboards.router)
app.include_router(profiles.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lithuanian Economics Portal API!"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    ) 