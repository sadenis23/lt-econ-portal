import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from .db import init_db
from .routes import reports, users, datasets, dashboards, profiles, auth
from fastapi import Request

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
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Lithuanian Economics Portal API!"}

@app.get("/test")
def test_endpoint():
    return {"status": "ok", "message": "Backend is accessible"}

@app.get("/sources")
def get_sources():
    """Return available data sources for reports"""
    return [
        {
            "id": "LB",
            "name": "Bank of Lithuania",
            "url": "https://www.lb.lt/en/statistics"
        },
        {
            "id": "StataLT",
            "name": "Statistics Lithuania",
            "url": "https://osp.stat.gov.lt/en"
        },
        {
            "id": "Eurostat",
            "name": "European Statistics",
            "url": "https://ec.europa.eu/eurostat"
        },
        {
            "id": "OECD",
            "name": "Organisation for Economic Co-operation and Development",
            "url": "https://data.oecd.org"
        },
        {
            "id": "IMF",
            "name": "International Monetary Fund",
            "url": "https://data.imf.org"
        },
        {
            "id": "WorldBank",
            "name": "World Bank",
            "url": "https://data.worldbank.org"
        }
    ]

@app.get("/api/auth/me")
def get_current_user(request: Request):
    """Return current user information from JWT token"""
    try:
        # Get the authorization header
        auth_header = request.headers.get('authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return JSONResponse(
                status_code=401,
                content={"error": "No valid authorization header"}
            )
        
        token = auth_header.split(' ')[1]
        
        # Decode the JWT token
        from jose import jwt, JWTError
        from .auth import SECRET_KEY, ALGORITHM
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        
        if not username:
            return JSONResponse(
                status_code=401,
                content={"error": "Invalid token"}
            )
        
        # Get user from database
        from sqlmodel import Session, select
        from .models import User
        from .db import engine
        
        with Session(engine) as session:
            user = session.exec(select(User).where(User.username == username)).first()
            if not user:
                return JSONResponse(
                    status_code=401,
                    content={"error": "User not found"}
                )
            
            return {
                "id": str(user.id),
                "email": user.email,
                "profile_complete": True  # You can implement proper profile completion logic
            }
            
    except JWTError:
        return JSONResponse(
            status_code=401,
            content={"error": "Invalid token"}
        )
    except Exception as e:
        print(f"Error in /api/auth/me: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error"}
        )

@app.get("/api/profile/me")
def get_current_profile():
    """Return current user profile information (placeholder for now)"""
    # This is a placeholder - in a real app, you'd fetch from database
    return {
        "id": 1,
        "user_id": 1,
        "username": "testuser",
        "email": "user@example.com",
        "role": "researcher",
        "language": "en",
        "newsletter": True,
        "digest_frequency": "weekly",
        "onboarding_completed": False,
        "topic_slugs": ["economy", "finance"],
        "topics": ["Economy", "Finance"],
        "created_at": "2025-01-01T00:00:00",
        "updated_at": "2025-01-01T00:00:00"
    }

@app.patch("/api/profile/update")
def update_profile():
    """Update current user profile (placeholder for now)"""
    # This is a placeholder - in a real app, you'd update the database
    return {"message": "Profile updated successfully"}

@app.get("/api/csrf")
def get_csrf_token():
    """Return CSRF token (placeholder for now)"""
    # This is a placeholder - in a real app, you'd generate a proper CSRF token
    return {"csrf_token": "placeholder-csrf-token"}

@app.post("/api/auth/set-refresh-token")
def set_refresh_token():
    """Set refresh token (placeholder for now)"""
    # This is a placeholder - in a real app, you'd set the refresh token in cookies
    return {"message": "Refresh token set successfully"}

@app.post("/api/auth/logout")
def logout():
    """Logout user (placeholder for now)"""
    # This is a placeholder - in a real app, you'd clear the refresh token cookie
    return {"message": "Logged out successfully"}

@app.get("/api/auth/check-session")
def check_session():
    """Check if user session is valid (placeholder for now)"""
    # This is a placeholder - in a real app, you'd validate the session
    return {"authenticated": False, "message": "No valid session found"}

@app.post("/api/auth/secure-logout")
def secure_logout():
    """Secure logout user (placeholder for now)"""
    # This is a placeholder - in a real app, you'd perform secure logout
    return {"message": "Secure logout completed"}

@app.get("/api/test-backend")
def test_backend():
    """Test backend connectivity"""
    return {"status": "ok", "message": "Backend is accessible via API"}

@app.post("/api/auth/login")
def login():
    """Login user (placeholder for now)"""
    # This is a placeholder - in a real app, you'd validate credentials
    return {"message": "Login successful", "refresh_token": "placeholder-token"}

@app.post("/api/auth/register")
def register():
    """Register user (placeholder for now)"""
    # This is a placeholder - in a real app, you'd create user account
    return {"message": "Registration successful", "refresh_token": "placeholder-token"}

@app.get("/api/reports")
def get_reports():
    """Return reports data (placeholder for now)"""
    # This is a placeholder - in a real app, you'd fetch from database
    return [
        {
            "id": "1",
            "title": "Q1 2024 Economic Overview",
            "date": "2024-03-31",
            "content": "Comprehensive analysis of Lithuania's economic performance in Q1 2024...",
            "topics": ["Economy", "Finance"],
            "sources": [
                {"id": "LB", "name": "Bank of Lithuania", "url": "https://www.lb.lt/en/statistics"}
            ]
        },
        {
            "id": "2", 
            "title": "Inflation Trends Analysis",
            "date": "2024-02-29",
            "content": "Detailed examination of inflation patterns and their economic implications...",
            "topics": ["Economy", "Prices"],
            "sources": [
                {"id": "StataLT", "name": "Statistics Lithuania", "url": "https://osp.stat.gov.lt/en"}
            ]
        }
    ]

@app.get("/api/sources")
def get_api_sources():
    """Return available data sources for reports"""
    return [
        {
            "id": "LB",
            "name": "Bank of Lithuania",
            "url": "https://www.lb.lt/en/statistics"
        },
        {
            "id": "StataLT",
            "name": "Statistics Lithuania",
            "url": "https://osp.stat.gov.lt/en"
        },
        {
            "id": "Eurostat",
            "name": "European Statistics",
            "url": "https://ec.europa.eu/eurostat"
        },
        {
            "id": "OECD",
            "name": "Organisation for Economic Co-operation and Development",
            "url": "https://data.oecd.org"
        },
        {
            "id": "IMF",
            "name": "International Monetary Fund",
            "url": "https://data.imf.org"
        },
        {
            "id": "WorldBank",
            "name": "World Bank",
            "url": "https://data.worldbank.org"
        }
    ]

@app.get("/api/dashboards")
def get_dashboards():
    """Return dashboards data (placeholder for now)"""
    # This is a placeholder - in a real app, you'd fetch from database
    return [
        {
            "id": "1",
            "title": "Economic Indicators Dashboard",
            "description": "Real-time economic indicators for Lithuania",
            "tags": ["economy", "indicators", "real-time"]
        },
        {
            "id": "2",
            "title": "Financial Markets Overview",
            "description": "Comprehensive view of financial markets and trends",
            "tags": ["finance", "markets", "trends"]
        },
        {
            "id": "3",
            "title": "Labor Market Analysis",
            "description": "Employment and labor market statistics",
            "tags": ["labor", "employment", "statistics"]
        }
    ]

@app.get("/api/datasets")
def get_datasets():
    """Return datasets data (placeholder for now)"""
    # This is a placeholder - in a real app, you'd fetch from database
    return [
        {
            "id": "1",
            "title": "GDP Growth Dataset",
            "description": "Historical GDP growth data for Lithuania",
            "tags": ["gdp", "growth", "historical"]
        },
        {
            "id": "2",
            "title": "Inflation Rate Dataset",
            "description": "Monthly inflation rate data",
            "tags": ["inflation", "prices", "monthly"]
        }
    ]

@app.post("/api/users/refresh")
def refresh_token():
    """Refresh access token (placeholder for now)"""
    # This is a placeholder - in a real app, you'd validate refresh token and issue new access token
    return {"access_token": "new-access-token", "message": "Token refreshed successfully"}

@app.patch("/api/profiles/me")
def update_profile_me():
    """Update current user profile (placeholder for now)"""
    # This is a placeholder - in a real app, you'd update the database
    return {"message": "Profile updated successfully"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    ) 