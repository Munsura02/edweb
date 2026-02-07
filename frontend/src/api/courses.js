import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Create a new course (status defaults to draft on backend).
 */
export async function createCourse({ title, image_url }) {
  const { data } = await api.post('/courses', { title, image_url: image_url || null });
  return data;
}

/**
 * Fetch courses, optionally filtered by status: 'draft' | 'published'.
 * No param = all courses.
 */
export async function getCourses(status = null) {
  const params = status ? { status } : {};
  const { data } = await api.get('/courses', { params });
  return data;
}

/**
 * Set course status to published.
 */
export async function publishCourse(id) {
  const { data } = await api.put(`/courses/${id}/publish`);
  return data;
}

/**
 * Set course status to draft.
 */
export async function draftCourse(id) {
  const { data } = await api.put(`/courses/${id}/draft`);
  return data;
}

/**
 * Permanently delete a course.
 */
export async function deleteCourse(id) {
  await api.delete(`/courses/${id}`);
}
