from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from .database import Base


class Course(Base):
    """Courses table for instructor dashboard. No auth."""
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, nullable=False, default="draft")  # "draft" | "published"
    image_url = Column(Text, nullable=True)
    course_url = Column(Text, nullable=True)
    rating = Column(Float, nullable=False, default=0.0)  # static display value
    instructor_name = Column(String, nullable=False, default="Instructor Doe")


class Enrollment(Base):
    """Learner enrollments. learner_name hardcoded; no auth."""
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    learner_name = Column(String, nullable=False, default="Learner User")
    progress = Column(Integer, nullable=False, default=0)  # 0–100
    completed = Column(Boolean, nullable=False, default=False)
    updated_at = Column(DateTime, nullable=True, default=datetime.utcnow, onupdate=datetime.utcnow)  # nullable for existing rows

    course = relationship("Course", backref="enrollments")


class Test(Base):
    """MCQ test: exactly 5 questions per course."""
    __tablename__ = "tests"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    question = Column(Text, nullable=False)
    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)
    correct_option = Column(String, nullable=False)  # "A" | "B" | "C" | "D"

    course = relationship("Course", backref="tests")


class TestAttempt(Base):
    """One attempt per learner per course. No retakes."""
    __tablename__ = "test_attempts"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    learner_name = Column(String, nullable=False, default="Learner User")
    correct_count = Column(Integer, nullable=False)
    points = Column(Integer, nullable=False)
    badge = Column(String, nullable=False)
    attempted_at = Column(DateTime, nullable=False, default=datetime.utcnow)

    course = relationship("Course", backref="test_attempts")
