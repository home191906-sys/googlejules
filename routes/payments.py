from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from models.database import get_db
from models.models import Payment, Course, Enrollment
from utils.auth_utils import decode_token
import razorpay
import hmac, hashlib
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/payments", tags=["Payments"])

# ⚠️ Apni Razorpay keys environment variables mein daalo
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_YOUR_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "YOUR_SECRET_KEY")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class CreateOrderRequest(BaseModel):
    course_id: int
    token: str

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    course_id: int
    token: str

# ---- Create Razorpay Order ----
@router.post("/create-order")
async def create_order(data: CreateOrderRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.token)
    student_id = payload["student_id"]

    course = db.query(Course).filter(Course.id == data.course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found!")

    # Amount in paise (INR * 100)
    amount_paise = int(course.price * 100)

    order = client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": f"order_{student_id}_{data.course_id}",
        "notes": {
            "course": course.title,
            "student_id": str(student_id)
        }
    })

    # Save pending payment
    payment = Payment(
        student_id=student_id,
        course_id=data.course_id,
        amount=course.price,
        razorpay_order_id=order["id"],
        status="pending"
    )
    db.add(payment)
    db.commit()

    return {
        "order_id": order["id"],
        "amount": amount_paise,
        "currency": "INR",
        "key": RAZORPAY_KEY_ID,
        "course_title": course.title
    }

# ---- Verify Payment & Enroll ----
@router.post("/verify")
async def verify_payment(data: VerifyPaymentRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.token)
    student_id = payload["student_id"]

    # Signature verify karo
    sign_string = f"{data.razorpay_order_id}|{data.razorpay_payment_id}"
    expected_signature = hmac.new(
        RAZORPAY_KEY_SECRET.encode(),
        sign_string.encode(),
        hashlib.sha256
    ).hexdigest()

    if expected_signature != data.razorpay_signature:
        raise HTTPException(status_code=400, detail="Payment verification failed!")

    # Payment update karo
    payment = db.query(Payment).filter(
        Payment.razorpay_order_id == data.razorpay_order_id
    ).first()
    if payment:
        payment.razorpay_payment_id = data.razorpay_payment_id
        payment.status = "success"
        db.commit()

    # Enroll karo
    already = db.query(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == data.course_id
    ).first()
    if not already:
        enrollment = Enrollment(student_id=student_id, course_id=data.course_id)
        db.add(enrollment)
        db.commit()

    return {"message": "Payment successful! Course enrolled.", "status": "success"}

# ---- Payment History ----
@router.get("/history")
async def payment_history(token: str, db: Session = Depends(get_db)):
    payload = decode_token(token)
    student_id = payload["student_id"]
    payments = db.query(Payment).filter(Payment.student_id == student_id).all()
    return [
        {
            "course_id": p.course_id,
            "amount": p.amount,
            "status": p.status,
            "date": p.created_at
        }
        for p in payments
    ]
