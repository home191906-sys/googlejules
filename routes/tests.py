from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from models.database import get_db
from models.models import Test, Question, Result
from utils.auth_utils import decode_token

router = APIRouter(prefix="/tests", tags=["Tests & Quiz"])

class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str  # A, B, C, or D
    marks: int = 1

class TestCreate(BaseModel):
    title: str
    course_id: int
    total_marks: int
    passing_marks: int
    duration_minutes: int = 30
    questions: List[QuestionCreate]

class SubmitAnswer(BaseModel):
    question_id: int
    selected_option: str

class SubmitTest(BaseModel):
    test_id: int
    token: str
    answers: List[SubmitAnswer]

# ---- Create Test with Questions (Admin) ----
@router.post("/create")
async def create_test(data: TestCreate, db: Session = Depends(get_db)):
    test = Test(
        title=data.title,
        course_id=data.course_id,
        total_marks=data.total_marks,
        passing_marks=data.passing_marks,
        duration_minutes=data.duration_minutes
    )
    db.add(test)
    db.commit()
    db.refresh(test)

    for q in data.questions:
        question = Question(
            test_id=test.id,
            question_text=q.question_text,
            option_a=q.option_a,
            option_b=q.option_b,
            option_c=q.option_c,
            option_d=q.option_d,
            correct_option=q.correct_option.upper(),
            marks=q.marks
        )
        db.add(question)

    db.commit()
    return {"message": "Test created successfully!", "test_id": test.id}

# ---- Get Test Questions ----
@router.get("/{test_id}/questions")
async def get_questions(test_id: int, db: Session = Depends(get_db)):
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found!")

    questions = db.query(Question).filter(Question.test_id == test_id).all()
    return {
        "test_id": test.id,
        "title": test.title,
        "total_marks": test.total_marks,
        "duration_minutes": test.duration_minutes,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "option_a": q.option_a,
                "option_b": q.option_b,
                "option_c": q.option_c,
                "option_d": q.option_d,
                "marks": q.marks
                # Note: correct_option show nahi kiya (security)
            }
            for q in questions
        ]
    }

# ---- Submit Test & Get Result ----
@router.post("/submit")
async def submit_test(data: SubmitTest, db: Session = Depends(get_db)):
    payload = decode_token(data.token)
    student_id = payload["student_id"]

    test = db.query(Test).filter(Test.id == data.test_id).first()
    if not test:
        raise HTTPException(status_code=404, detail="Test not found!")

    # Check if already attempted
    existing = db.query(Result).filter(
        Result.student_id == student_id,
        Result.test_id == data.test_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Test already submitted!")

    # Calculate score
    marks_obtained = 0
    answer_map = {a.question_id: a.selected_option.upper() for a in data.answers}

    questions = db.query(Question).filter(Question.test_id == data.test_id).all()
    for q in questions:
        if answer_map.get(q.id) == q.correct_option:
            marks_obtained += q.marks

    percentage = (marks_obtained / test.total_marks) * 100
    passed = marks_obtained >= test.passing_marks

    result = Result(
        student_id=student_id,
        test_id=data.test_id,
        marks_obtained=marks_obtained,
        total_marks=test.total_marks,
        percentage=round(percentage, 2),
        passed=passed
    )
    db.add(result)
    db.commit()

    return {
        "message": "Test submitted!",
        "marks_obtained": marks_obtained,
        "total_marks": test.total_marks,
        "percentage": round(percentage, 2),
        "passed": passed,
        "status": "✅ PASS" if passed else "❌ FAIL"
    }

# ---- Get My Results ----
@router.get("/my/results")
async def my_results(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    student_id = payload["student_id"]
    results = db.query(Result).filter(Result.student_id == student_id).all()
    return [
        {
            "test": r.test.title,
            "marks": f"{r.marks_obtained}/{r.total_marks}",
            "percentage": r.percentage,
            "passed": r.passed,
            "date": r.date
        }
        for r in results
    ]
