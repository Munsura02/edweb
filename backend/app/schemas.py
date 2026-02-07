from pydantic import BaseModel, HttpUrl


# -------- Course Schemas --------

class CourseURLUpdate(BaseModel):
    """Request body for updating course URL."""
    course_url: HttpUrl


class CourseCreate(BaseModel):
    title: str
    image_url: str | None = None
    course_url: str | None = None


class CourseResponse(BaseModel):
    id: int
    title: str
    status: str
    image_url: str | None
    course_url: str | None
    rating: float
    instructor_name: str
    has_test: bool = False  # Only set when explicitly included

    class Config:
        from_attributes = True


# -------- Learner / Enrollment Schemas --------

class EnrollmentResponse(BaseModel):
    id: int
    course_id: int
    learner_name: str
    progress: int
    completed: bool

    class Config:
        from_attributes = True


class MyCourseResponse(BaseModel):
    """Enrolled course with progress for learner my-courses."""
    id: int
    title: str
    status: str
    image_url: str | None
    course_url: str | None
    rating: float
    instructor_name: str
    progress: int
    completed: bool
    has_test: bool = False
    test_attempted: bool = False
    test_result: dict | None = None  # {correct_count, points, badge} if attempted

    class Config:
        from_attributes = True


class RecentActivityResponse(BaseModel):
    """Recent learner activity for instructor dashboard."""
    activity_type: str  # "enrollment" | "test"
    learner_name: str
    course_title: str
    progress: int | None = None
    score: int | None = None
    points: int | None = None
    badge: str | None = None
    updated_at: str

    class Config:
        from_attributes = True


# -------- Test Schemas --------

class TestItemCreate(BaseModel):
    question: str
    options: list[str]  # [A, B, C, D] - 4 option texts
    correct_option: int  # 0-based index (0=A, 1=B, 2=C, 3=D)


class TestCreate(BaseModel):
    tests: list[TestItemCreate]


class TestQuestionResponse(BaseModel):
    """Question for learner - no correct_option. Only question + options."""
    id: int
    question: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

    class Config:
        from_attributes = True


class TestSubmitRequest(BaseModel):
    answers: list[dict]  # [{"question_id": 1, "answer": "A"}, ...]


class TestSubmitResponse(BaseModel):
    correct_count: int
    points: int
    badge: str


class AchievementResponse(BaseModel):
    badge: str
    points: int
    course_title: str
    attempted_at: str

    class Config:
        from_attributes = True
