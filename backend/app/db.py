from sqlmodel import SQLModel, create_engine, Session, select
from .models import EconomicReport, User, Dataset, Dashboard, Profile, Topic, ProfileTopic
from passlib.context import CryptContext

# Database URL - in production, use environment variable
DATABASE_URL = "sqlite:///./lt_econ_portal.db"

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    """Initialize database with tables and sample data"""
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Check if we already have data
        if session.exec(select(User)).first():
            print("Database already initialized, skipping data creation")
            return  # Database already initialized
        
        # Create sample topics
        topics = [
            Topic(
                slug="economy",
                name_lt="Ekonomika",
                name_en="Economy",
                description_lt="Bendri ekonomikos rodikliai ir tendencijos",
                description_en="General economic indicators and trends",
                icon="trending-up"
            ),
            Topic(
                slug="labor",
                name_lt="Darbo rinka",
                name_en="Labor",
                description_lt="Užimtumas, atlyginimai ir darbo rinkos duomenys",
                description_en="Employment, wages, and labor market data",
                icon="users"
            ),
            Topic(
                slug="prices",
                name_lt="Kainos",
                name_en="Prices",
                description_lt="Infliacija, kainų indeksai ir pragyvenimo kaina",
                description_en="Inflation, price indices, and cost of living",
                icon="dollar-sign"
            ),
            Topic(
                slug="public_finance",
                name_lt="Viešosios finansės",
                name_en="Public Finance",
                description_lt="Valstybės biudžetai, mokesčiai ir išlaidos",
                description_en="Government budgets, taxes, and spending",
                icon="building"
            ),
            Topic(
                slug="social_indicators",
                name_lt="Socialiniai rodikliai",
                name_en="Social Indicators",
                description_lt="Demografija, sveikata ir socialinė statistika",
                description_en="Demographics, health, and social statistics",
                icon="heart"
            ),
            Topic(
                slug="energy",
                name_lt="Energetika",
                name_en="Energy",
                description_lt="Energijos gamyba, suvartojimas ir kainos",
                description_en="Energy production, consumption, and prices",
                icon="zap"
            ),
            Topic(
                slug="environment",
                name_lt="Aplinkosauga",
                name_en="Environment",
                description_lt="Aplinkos duomenys ir tvarumo metrikos",
                description_en="Environmental data and sustainability metrics",
                icon="leaf"
            ),
            Topic(
                slug="regional",
                name_lt="Regionai",
                name_en="Regional",
                description_lt="Regionų ekonomikos duomenys ir palyginimai",
                description_en="Regional economic data and comparisons",
                icon="map-pin"
            ),
            Topic(
                slug="data",
                name_lt="Duomenys",
                name_en="Data",
                description_lt="Neapdoroti duomenų rinkiniai ir atsisiuntimai",
                description_en="Raw datasets and data downloads",
                icon="database"
            ),
        ]
        
        for topic in topics:
            # Check if topic already exists
            existing = session.exec(select(Topic).where(Topic.slug == topic.slug)).first()
            if not existing:
                session.add(topic)
                print(f"Added topic: {topic.slug}")
            else:
                print(f"Topic already exists: {topic.slug}")
        
        # Create sample dashboards with tags
        import json
        dashboards = [
            Dashboard(
                title="Inflation Overview",
                description="Comprehensive view of price changes across sectors",
                tags=json.dumps(["prices", "economy", "inflation"])
            ),
            Dashboard(
                title="Labor Market Trends",
                description="Employment and wage statistics",
                tags=json.dumps(["labor", "employment", "wages"])
            ),
            Dashboard(
                title="Public Budget Analysis",
                description="Government revenue and expenditure breakdown",
                tags=json.dumps(["public_finance", "budget", "government"])
            ),
            Dashboard(
                title="Regional Economic Comparison",
                description="Economic indicators by region",
                tags=json.dumps(["regional", "economy", "comparison"])
            ),
            Dashboard(
                title="Energy Consumption Patterns",
                description="Energy usage and production statistics",
                tags=json.dumps(["energy", "consumption", "production"])
            ),
            Dashboard(
                title="Social Wellbeing Indicators",
                description="Health, education, and social metrics",
                tags=json.dumps(["social_indicators", "health", "education"])
            ),
        ]
        
        for dashboard in dashboards:
            session.add(dashboard)
        
        # Create sample economic reports
        reports = [
            EconomicReport(
                title="Q3 2024 Economic Outlook",
                content="Analysis of current economic trends and future projections...",
                date="2024-10-15"
            ),
            EconomicReport(
                title="Labor Market Recovery Report",
                content="Comprehensive analysis of employment trends post-pandemic...",
                date="2024-09-20"
            ),
        ]
        
        for report in reports:
            session.add(report)
        
        # Create sample datasets
        datasets = [
            Dataset(
                name="Monthly Inflation Data",
                description="Consumer Price Index monthly data",
                source_url="https://example.com/inflation-data"
            ),
            Dataset(
                name="Employment Statistics",
                description="Quarterly employment and unemployment data",
                source_url="https://example.com/employment-data"
            ),
        ]
        
        for dataset in datasets:
            session.add(dataset)
        
        try:
            session.commit()
            print("Database initialization completed successfully")
        except Exception as e:
            print(f"Error during database initialization: {e}")
            session.rollback()
            raise

def get_session():
    """Get database session"""
    with Session(engine) as session:
        yield session

def hash_password(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password) 