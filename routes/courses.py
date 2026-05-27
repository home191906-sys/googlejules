from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from models.database import get_db
from models.models import Course, Video, Enrollment, Student
from utils.auth_utils import decode_token
import shutil, os

router = APIRouter(prefix="/courses", tags=["Courses"])
UPLOAD_DIR = "frontend/static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# ---- Get all courses ----
@router.get("/")
async def get_courses(db: Session = Depends(get_db)):
    courses = db.query(Course).filter(Course.is_active == True).all()
    return [
        {
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "thumbnail": c.thumbnail,
            "price": c.price,
            "video_count": len(c.videos)
        }
        for c in courses
    ]

# ---- Get single course ----
@router.get("/{course_id}")
async def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found!")
    return {
        "id": course.id,
        "title": course.title,
        "description": course.description,
        "price": course.price,
        "thumbnail": course.thumbnail,
        "videos": [{"id": v.id, "title": v.title, "duration": v.duration} for v in course.videos],
        "tests": [{"id": t.id, "title": t.title, "total_marks": t.total_marks} for t in course.tests]
    }

# ---- Create course (Admin) ----
@router.post("/create")
async def create_course(
    title: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    thumbnail: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    thumbnail_path = None
    if thumbnail:
        filename = f"thumb_{thumbnail.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            shutil.copyfileobj(thumbnail.file, f)
        thumbnail_path = f"/static/uploads/{filename}"

    course = Course(
        title=title,
        description=description,
        price=price,
        thumbnail=thumbnail_path
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return {"message": "Course created!", "course_id": course.id}

# ---- Upload video to course ----
@router.post("/{course_id}/upload-video")
async def upload_video(
    course_id: int,
    title: str = Form(...),
    duration: str = Form(...),
    video: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found!")

    filename = f"video_{course_id}_{video.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(video.file, f)

    video_obj = Video(
        title=title,
        video_path=f"/static/uploads/{filename}",
        duration=duration,
        course_id=course_id
    )
    db.add(video_obj)
    db.commit()
    return {"message": "Video uploaded!", "video_path": video_obj.video_path}

# ---- Enroll in course ----
@router.post("/{course_id}/enroll")
async def enroll_course(course_id: int, token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    student_id = payload["student_id"]

    already = db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == course_id
    ).first()
    if already:
        raise HTTPException(status_code=400, detail="Already enrolled!")

    enrollment = Enrollment(student_id=student_id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully!"}

# ---- My courses ----
@router.get("/my/enrolled")
async def my_courses(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    student_id = payload["student_id"]
    enrollments = db.query(Enrollment).filter(Enrollment.student_id == student_id).all()
    return [
        {
            "course_id": e.course_id,
            "title": e.course.title,
            "enrolled_at": e.enrolled_at
        }
        for e in enrollments
    ]
