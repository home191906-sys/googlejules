# 🎓 Coaching LMS - Complete Setup Guide

## Project Structure
```
coaching-lms/
├── backend/
│   ├── main.py              ← FastAPI app
│   ├── models/
│   │   ├── models.py        ← Database models
│   │   └── database.py      ← DB connection
│   ├── routes/
│   │   ├── auth.py          ← Login/Register
│   │   ├── courses.py       ← Courses & Videos
│   │   ├── tests.py         ← Quiz & Tests
│   │   └── payments.py      ← Razorpay payment
│   └── utils/
│       └── auth_utils.py    ← JWT helpers
├── frontend/
│   ├── templates/
│   │   └── index.html       ← Main website
│   └── static/
│       ├── js/app.js        ← Frontend logic
│       └── uploads/         ← Videos & images
└── requirements.txt
```

## ⚡ Setup Steps

### Step 1: Python Install karo
```bash
cd coaching-lms
python -m venv venv
venv\Scripts\activate       # Windows
source venv/bin/activate    # Linux/Mac
pip install -r requirements.txt
```

### Step 2: Razorpay Keys Setup
`backend/routes/payments.py` mein apni keys daalo:
```python
RAZORPAY_KEY_ID = "rzp_test_TUMHARI_KEY"
RAZORPAY_KEY_SECRET = "TUMHARA_SECRET"
```
Keys milti hain: https://dashboard.razorpay.com

### Step 3: Server Start karo
```bash
cd backend
uvicorn main:app --reload
```

### Step 4: Website open karo
- Website: http://localhost:8000/static/templates/index.html
- API Docs: http://localhost:8000/docs  ← Yahan sab test kar sakte ho

## 🔑 Important API Endpoints

| Feature | Method | URL |
|---------|--------|-----|
| Register | POST | /auth/register |
| Login | POST | /auth/login |
| Get Courses | GET | /courses/ |
| Create Course | POST | /courses/create |
| Upload Video | POST | /courses/{id}/upload-video |
| Enroll | POST | /courses/{id}/enroll |
| Create Test | POST | /tests/create |
| Submit Test | POST | /tests/submit |
| My Results | GET | /tests/my/results |
| Create Order | POST | /payments/create-order |
| Verify Payment | POST | /payments/verify |

## ⚠️ Production ke liye:
1. SECRET_KEY badlo (auth_utils.py mein)
2. SQLite → PostgreSQL use karo
3. Razorpay test keys → live keys
4. HTTPS use karo
