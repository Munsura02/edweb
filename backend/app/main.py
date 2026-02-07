from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from .database import engine, get_db, Base
from .models import Course, Enrollment, Test, TestAttempt
from .schemas import (
    CourseCreate, CourseResponse, CourseURLUpdate, MyCourseResponse, RecentActivityResponse,
    TestCreate, TestQuestionResponse, TestSubmitRequest, TestSubmitResponse,
    AchievementResponse,
)

# Create tables on startup
Base.metadata.create_all(bind=engine)


# Add updated_at to enrollments if missing
def _ensure_updated_at_column():
    with engine.connect() as conn:
        r = conn.execute(text("PRAGMA table_info(enrollments)"))
        cols = [row[1] for row in r]
        if "updated_at" not in cols:
            conn.execute(text("ALTER TABLE enrollments ADD COLUMN updated_at DATETIME"))
            conn.commit()


# Add course_url to courses if missing
def _ensure_course_url_column():
    with engine.connect() as conn:
        r = conn.execute(text("PRAGMA table_info(courses)"))
        cols = [row[1] for row in r]
        if "course_url" not in cols:
            conn.execute(text("ALTER TABLE courses ADD COLUMN course_url TEXT"))
            conn.commit()


try:
    _ensure_updated_at_column()
    _ensure_course_url_column()
except Exception:
    pass  # Table may not exist yet

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- Course APIs --------

@app.post("/courses", response_model=CourseResponse)
def create_course(course: CourseCreate, db: Session = Depends(get_db)):
    """Create a new course. Default status is draft."""
    db_course = Course(
        title=course.title,
        image_url=course.image_url or "",
        course_url=course.course_url or None,
        status="draft",
        rating=0.0,
        instructor_name="Instructor Doe",
    )
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return CourseResponse(id=db_course.id, title=db_course.title, status=db_course.status, image_url=db_course.image_url,
                          course_url=db_course.course_url, rating=db_course.rating, instructor_name=db_course.instructor_name, has_test=False)


@app.get("/courses", response_model=list[CourseResponse])
def get_courses(
    status: str | None = Query(None, description="Filter: draft | published"),
    db: Session = Depends(get_db),
):
    """Fetch all courses, optionally filtered by status."""
    q = db.query(Course)
    if status is not None:
        if status not in ("draft", "published"):
            raise HTTPException(400, "status must be 'draft' or 'published'")
        q = q.filter(Course.status == status)
    courses = q.order_by(Course.id).all()
    out = []
    for c in courses:
        test_count = db.query(Test).filter(Test.course_id == c.id).count()
        out.append(CourseResponse(
            id=c.id, title=c.title, status=c.status, image_url=c.image_url, course_url=c.course_url,
            rating=c.rating, instructor_name=c.instructor_name, has_test=(test_count == 5)
        ))
    return out


@app.put("/courses/{course_id}/publish", response_model=CourseResponse)
def publish_course(course_id: int, db: Session = Depends(get_db)):
    """Set course status to published."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    course.status = "published"
    db.commit()
    db.refresh(course)
    return course


@app.put("/courses/{course_id}/draft", response_model=CourseResponse)
def draft_course(course_id: int, db: Session = Depends(get_db)):
    """Set course status to draft."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    course.status = "draft"
    db.commit()
    db.refresh(course)
    return course


@app.delete("/courses/{course_id}")
def delete_course(course_id: int, db: Session = Depends(get_db)):
    """Permanently remove the course."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    db.delete(course)
    db.commit()
    return {"ok": True}


@app.put("/courses/{course_id}/url")
def update_course_url(course_id: int, body: CourseURLUpdate, db: Session = Depends(get_db)):
    """
    Update the learning URL for a course so learners can click Continue Learning.

    Frontend usage:
    - Instructor: Call PUT /courses/{course_id}/url with body { "course_url": "https://..." }
      to set/update the URL. Use this from an edit modal or course settings.
    - Learner: On "Continue Learning" click, if course_url is set: window.open(course_url, '_blank').
      If course_url is null/empty: disable button and show "No course URL set".
    """
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    url_str = str(body.course_url)
    course.course_url = url_str
    db.commit()
    db.refresh(course)
    return {
        "message": "Course URL updated successfully",
        "course_id": course_id,
        "course_url": url_str,
    }


# -------- Learner APIs --------

LEARNER_NAME = "Learner User"
PROGRESS_STEP = 10


@app.get("/learner/courses", response_model=list[CourseResponse])
def get_published_courses(db: Session = Depends(get_db)):
    """Return only published courses (for learner explore)."""
    courses = db.query(Course).filter(Course.status == "published").order_by(Course.id).all()
    return [
        CourseResponse(id=c.id, title=c.title, status=c.status, image_url=c.image_url, course_url=c.course_url,
                       rating=c.rating, instructor_name=c.instructor_name, has_test=db.query(Test).filter(Test.course_id == c.id).count() == 5)
        for c in courses
    ]


@app.post("/enroll/{course_id}")
def enroll(course_id: int, db: Session = Depends(get_db)):
    """Create enrollment. learner_name hardcoded, progress=0."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    if course.status != "published":
        raise HTTPException(400, "Course is not published")
    existing = db.query(Enrollment).filter(
        Enrollment.course_id == course_id,
        Enrollment.learner_name == LEARNER_NAME,
    ).first()
    if existing:
        return {"enrolled": True, "enrollment_id": existing.id}
    enrollment = Enrollment(
        course_id=course_id,
        learner_name=LEARNER_NAME,
        progress=0,
        completed=False,
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return {"enrolled": True, "enrollment_id": enrollment.id}


@app.get("/learner/my-courses", response_model=list[MyCourseResponse])
def get_my_courses(db: Session = Depends(get_db)):
    """Join enrollments + courses; return progress and completed for learner."""
    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.learner_name == LEARNER_NAME)
        .all()
    )
    out = []
    for e in enrollments:
        c = e.course
        if not c:
            continue
        test_count = db.query(Test).filter(Test.course_id == c.id).count()
        has_test = test_count == 5
        attempt = db.query(TestAttempt).filter(
            TestAttempt.course_id == c.id,
            TestAttempt.learner_name == LEARNER_NAME,
        ).first()
        out.append(MyCourseResponse(
            id=c.id,
            title=c.title,
            status=c.status,
            image_url=c.image_url,
            course_url=c.course_url,
            rating=c.rating,
            instructor_name=c.instructor_name,
            progress=e.progress,
            completed=e.completed,
            has_test=has_test,
            test_attempted=attempt is not None,
            test_result={"correct_count": attempt.correct_count, "points": attempt.points, "badge": attempt.badge} if attempt else None,
        ))
    return out


@app.put("/learner/progress/{course_id}")
def update_progress(course_id: int, db: Session = Depends(get_db)):
    """Increase progress by fixed step; if progress >= 100 set completed=true."""
    enrollment = (
        db.query(Enrollment)
        .filter(
            Enrollment.course_id == course_id,
            Enrollment.learner_name == LEARNER_NAME,
        )
        .first()
    )
    if not enrollment:
        raise HTTPException(404, "Enrollment not found")
    enrollment.progress = min(100, enrollment.progress + PROGRESS_STEP)
    if enrollment.progress >= 100:
        enrollment.completed = True
        enrollment.progress = 100
    enrollment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(enrollment)
    return {"progress": enrollment.progress, "completed": enrollment.completed}


# -------- Instructor APIs --------

INSTRUCTOR_NAME = "Instructor Doe"


BADGE_MAP = {20: "Newbie", 40: "Explorer", 60: "Achiever", 80: "Specialist", 100: "Expert"}


def _points_to_badge(points: int) -> str:
    for threshold in sorted(BADGE_MAP.keys(), reverse=True):
        if points >= threshold:
            return BADGE_MAP[threshold]
    return "Newbie"


@app.get("/instructor/recent-activities", response_model=list[RecentActivityResponse])
def get_recent_activities(db: Session = Depends(get_db)):
    """Recent learner activity: enrollments + test completions. Limit 5."""
    activities = []
    for e in db.query(Enrollment).join(Course).filter(
        Course.status == "published", Course.instructor_name == INSTRUCTOR_NAME
    ).all():
        c = e.course
        if c and e.updated_at:
            activities.append((e.updated_at, RecentActivityResponse(
                activity_type="enrollment",
                learner_name=e.learner_name,
                course_title=c.title,
                progress=e.progress,
                score=None, points=None, badge=None,
                updated_at=e.updated_at.isoformat(),
            )))
    for t in db.query(TestAttempt).join(Course).filter(
        Course.instructor_name == INSTRUCTOR_NAME
    ).all():
        c = t.course
        if c:
            activities.append((t.attempted_at, RecentActivityResponse(
                activity_type="test",
                learner_name=t.learner_name,
                course_title=c.title,
                progress=None,
                score=t.correct_count,
                points=t.points,
                badge=t.badge,
                updated_at=t.attempted_at.isoformat(),
            )))
    activities.sort(key=lambda x: x[0], reverse=True)
    return [a[1] for a in activities[:5]]


# -------- Test APIs --------

@app.post("/courses/{course_id}/tests")
def create_tests(course_id: int, body: TestCreate, db: Session = Depends(get_db)):
    """Create MCQs. Prevent duplicates. correct_option is 0-based index."""
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    existing = db.query(Test).filter(Test.course_id == course_id).first()
    if existing:
        raise HTTPException(400, "Test already exists for this course")
    if len(body.tests) != 5:
        raise HTTPException(400, "Exactly 5 questions required")
    LETTERS = ("A", "B", "C", "D")
    for i, q in enumerate(body.tests):
        if len(q.options) != 4:
            raise HTTPException(400, f"Question {i + 1}: options must have exactly 4 items")
        if not isinstance(q.correct_option, int) or q.correct_option < 0 or q.correct_option > 3:
            raise HTTPException(400, f"Question {i + 1}: correct_option must be 0, 1, 2, or 3")
    for q in body.tests:
        opts = q.options
        correct_letter = LETTERS[q.correct_option]
        t = Test(
            course_id=course_id,
            question=q.question,
            option_a=opts[0],
            option_b=opts[1],
            option_c=opts[2],
            option_d=opts[3],
            correct_option=correct_letter,
        )
        db.add(t)
    db.commit()
    return {"message": "Test created successfully", "course_id": course_id}


@app.get("/courses/{course_id}/tests", response_model=list[TestQuestionResponse])
def get_tests(course_id: int, db: Session = Depends(get_db)):
    """Return questions without correct_option."""
    tests = db.query(Test).filter(Test.course_id == course_id).order_by(Test.id).all()
    return [
        TestQuestionResponse(id=t.id, question=t.question, option_a=t.option_a, option_b=t.option_b, option_c=t.option_c, option_d=t.option_d)
        for t in tests
    ]


@app.post("/courses/{course_id}/tests/submit", response_model=TestSubmitResponse)
def submit_test(course_id: int, body: TestSubmitRequest, db: Session = Depends(get_db)):
    """Evaluate, save, return score/points/badge. One attempt per learner."""
    existing = db.query(TestAttempt).filter(
        TestAttempt.course_id == course_id,
        TestAttempt.learner_name == LEARNER_NAME,
    ).first()
    if existing:
        raise HTTPException(400, "Already attempted. No retakes.")
    tests = {t.id: t for t in db.query(Test).filter(Test.course_id == course_id).all()}
    if len(tests) != 5:
        raise HTTPException(404, "Test not found or incomplete")
    correct = 0
    answer_map = {a.get("question_id"): a.get("answer") for a in body.answers}
    for tid, t in tests.items():
        ans = str(answer_map.get(tid) or "").strip().upper()
        if ans in ("A", "B", "C", "D") and ans == t.correct_option:
            correct += 1
    points = correct * 20
    badge = _points_to_badge(points)
    attempt = TestAttempt(course_id=course_id, learner_name=LEARNER_NAME, correct_count=correct, points=points, badge=badge)
    db.add(attempt)
    db.commit()
    return TestSubmitResponse(correct_count=correct, points=points, badge=badge)


@app.get("/courses/{course_id}/tests/attempt")
def get_test_attempt(course_id: int, db: Session = Depends(get_db)):
    """Check if learner has attempted (for Take Test vs View Result)."""
    a = db.query(TestAttempt).filter(
        TestAttempt.course_id == course_id,
        TestAttempt.learner_name == LEARNER_NAME,
    ).first()
    if not a:
        return {"attempted": False}
    return {"attempted": True, "correct_count": a.correct_count, "points": a.points, "badge": a.badge}


@app.get("/learner/achievements", response_model=list[AchievementResponse])
def get_achievements(db: Session = Depends(get_db)):
    """Badges earned by learner."""
    attempts = db.query(TestAttempt).filter(TestAttempt.learner_name == LEARNER_NAME).order_by(TestAttempt.attempted_at.desc()).all()
    out = []
    for a in attempts:
        c = a.course
        out.append(AchievementResponse(badge=a.badge, points=a.points, course_title=c.title if c else "Unknown", attempted_at=a.attempted_at.isoformat()))
    return out
