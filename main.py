from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from models.database import create_tables
from routes import auth, courses, tests, payments
import os

app = FastAPI(
    title="Coaching LMS API",
    description="Complete Learning Management System",
    version="1.0.0"
)

# CORS allow karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files
os.makedirs("frontend/static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="frontend/static"), name="static")

# Routes
app.include_router(auth.router)
app.include_router(courses.router)
app.include_router(tests.router)
app.include_router(payments.router)

# Database tables create karo
@app.on_event("startup")
async def startup():
    create_tables()
    print("✅ Database tables created!")

@app.get("/")
async def root():
    return {"message": "Coaching LMS API is running! Docs: /docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
