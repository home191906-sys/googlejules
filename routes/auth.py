from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from models.database import get_db
from models.models import Student
from utils.auth_utils import hash_password, verify_password, create_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email exists
    existing = db.query(Student).filter(Student.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered!")

    # Create new student
    student = Student(
        name=data.name,
        email=data.email,
        phone=data.phone,
        password=hash_password(data.password)
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_token({"student_id": student.id, "email": student.email})
    return {
        "message": "Registration successful!",
        "token": token,
        "student": {"id": student.id, "name": student.name, "email": student.email}
    }

@router.post("/login")
async def login(data: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == data.email).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found!")

    if not verify_password(data.password, student.password):
        raise HTTPException(status_code=401, detail="Wrong password!")

    if not student.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled!")

    token = create_token({"student_id": student.id, "email": student.email})
    return {
        "message": "Login successful!",
        "token": token,
        "student": {"id": student.id, "name": student.name, "email": student.email}
    }

@router.get("/profile")
async def get_profile(token: str, db: Session = Depends(get_db)):
    from utils.auth_utils import decode_token
    payload = decode_token(token)
    student = db.query(Student).filter(Student.id == payload["student_id"]).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found!")
    return {
        "id": student.id,
        "name": student.name,
        "email": student.email,
        "phone": student.phone,
        "created_at": student.created_at
    }
