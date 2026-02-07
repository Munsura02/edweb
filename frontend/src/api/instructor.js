import axios from 'axios';

const API_BASE = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch recent learner activities for instructor's published courses.
 */
export async function getRecentActivities() {
  const { data } = await api.get('/instructor/recent-activities');
  return data;
}
