import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.models import Base
from dotenv import load_dotenv

load_dotenv()

# Default to None if not provided to force configuration in production
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # Use SQLite only for local development if no DATABASE_URL is set
    DATABASE_URL = "sqlite:///./coaching_lms.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)
