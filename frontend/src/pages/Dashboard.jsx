import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRecentActivities } from '../api/instructor';

export default function Dashboard() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getRecentActivities()
      .then((data) => setActivities(Array.isArray(data) ? data : []))
      .catch(() => setActivities([]));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Track your performance and student engagement.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            View Analytics
          </button>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <span>+</span>
            <span>Create Course</span>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Students</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">1,234</p>
          <p className="text-sm text-green-600 mt-1">+12%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Active Courses</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
          <p className="text-sm text-green-600 mt-1">+2%</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Hours Taught</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">890</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Revenue (Mo)</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$4,500</p>
          <p className="text-sm text-green-600 mt-1">+8%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Engagement Overview</h2>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700">
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">Chart area</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {activities.length === 0 && <li>No recent activity yet</li>}
            {activities.map((a, i) => (
              <li key={i}>
                {a.learner_name} enrolled in {a.course_title} – {a.progress}% completed
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
