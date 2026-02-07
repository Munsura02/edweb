import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/** Get only published courses (for explore). */
export async function getPublishedCourses() {
  const { data } = await api.get('/learner/courses');
  return data;
}

/** Enroll in a course. */
export async function enrollInCourse(courseId) {
  const { data } = await api.post(`/enroll/${courseId}`);
  return data;
}

/** Get learner's enrolled courses with progress. */
export async function getMyCourses() {
  const { data } = await api.get('/learner/my-courses');
  return data;
}

/** Update progress for a course (simulation: +10). */
export async function updateProgress(courseId) {
  const { data } = await api.put(`/learner/progress/${courseId}`);
  return data;
}
