import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyCourses, updateProgress } from '../../api/learner';

// Derive lesson count from progress for display (e.g. 65% -> 15/24)
const TOTAL_LESSONS = 24;
function lessonsFromProgress(progress) {
  const done = Math.round((progress / 100) * TOTAL_LESSONS);
  return { done: Math.min(done, TOTAL_LESSONS), total: TOTAL_LESSONS };
}

export default function LearnerDashboard() {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyCourses()
      .then((data) => { if (!cancelled) setMyCourses(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setMyCourses([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Highlighted course: first enrolled with highest progress (not completed)
  const continueCourse = myCourses
    .filter((c) => !c.completed)
    .sort((a, b) => b.progress - a.progress)[0] || myCourses[0];

  const handleResume = async (courseId) => {
    try {
      await updateProgress(courseId);
      const data = await getMyCourses();
      setMyCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update progress');
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Continue Course - highlighted */}
      {continueCourse && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8 flex flex-col md:flex-row">
          <div className="relative flex-1 min-h-[200px] md:min-h-[240px] bg-gray-800">
            {continueCourse.image_url ? (
              <img src={continueCourse.image_url} alt={continueCourse.title} className="w-full h-full object-cover opacity-80" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleResume(continueCourse.id)}
                className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700"
                aria-label="Resume"
              >
                <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
              </button>
            </div>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-bold text-gray-900">{continueCourse.title}</h2>
            <p className="text-gray-500 mt-1">Instructor: {continueCourse.instructor_name}</p>
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>{continueCourse.progress}% Complete</span>
                <span>{lessonsFromProgress(continueCourse.progress).done}/{lessonsFromProgress(continueCourse.progress).total} Lessons</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${continueCourse.progress}%` }} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">Next up: Continue learning</p>
            <button
              type="button"
              onClick={() => handleResume(continueCourse.id)}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-fit"
            >
              Resume Course
            </button>
          </div>
        </div>
      )}

      {/* Your Courses */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Your Courses</h2>
        <Link to="/learner/my-courses" className="text-purple-600 hover:text-purple-700 text-sm font-medium">View All →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myCourses.slice(0, 3).map((course) => (
          <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="relative aspect-video bg-gray-200">
              {course.image_url ? (
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
              )}
              <span className="absolute top-2 left-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">Course</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-0.5">Instructor: {course.instructor_name}</p>
            </div>
          </div>
        ))}
      </div>
      {myCourses.length === 0 && !loading && (
        <p className="text-gray-500">You have no enrolled courses. <Link to="/learner/explore" className="text-purple-600 hover:underline">Explore courses</Link>.</p>
      )}
    </div>
  );
}
