from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(15))
    password = Column(String(200), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)

    enrollments = relationship("Enrollment", back_populates="student")
    results = relationship("Result", back_populates="student")
    payments = relationship("Payment", back_populates="student")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text)
    video_url = Column(String(300))
    thumbnail = Column(String(300))
    price = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)

    videos = relationship("Video", back_populates="course")
    tests = relationship("Test", back_populates="course")
    enrollments = relationship("Enrollment", back_populates="course")

class Video(Base):
    __tablename__ = "videos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    video_path = Column(String(300))
    duration = Column(String(20))
    course_id = Column(Integer, ForeignKey("courses.id"))
    order_no = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.now)

    course = relationship("Course", back_populates="videos")

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    course_id = Column(Integer, ForeignKey("courses.id"))
    total_marks = Column(Integer)
    passing_marks = Column(Integer)
    duration_minutes = Column(Integer, default=30)
    is_active = Column(Boolean, default=True)

    course = relationship("Course", back_populates="tests")
    questions = relationship("Question", back_populates="test")
    results = relationship("Result", back_populates="test")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    test_id = Column(Integer, ForeignKey("tests.id"))
    question_text = Column(Text)
    option_a = Column(String(200))
    option_b = Column(String(200))
    option_c = Column(String(200))
    option_d = Column(String(200))
    correct_option = Column(String(1))  # A, B, C, D
    marks = Column(Integer, default=1)

    test = relationship("Test", back_populates="questions")

class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    test_id = Column(Integer, ForeignKey("tests.id"))
    marks_obtained = Column(Integer)
    total_marks = Column(Integer)
    percentage = Column(Float)
    passed = Column(Boolean)
    date = Column(DateTime, default=datetime.now)

    student = relationship("Student", back_populates="results")
    test = relationship("Test", back_populates="results")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    enrolled_at = Column(DateTime, default=datetime.now)

    student = relationship("Student", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    amount = Column(Float)
    razorpay_order_id = Column(String(100))
    razorpay_payment_id = Column(String(100))
    status = Column(String(20), default="pending")  # pending, success, failed
    created_at = Column(DateTime, default=datetime.now)

    student = relationship("Student", back_populates="payments")
