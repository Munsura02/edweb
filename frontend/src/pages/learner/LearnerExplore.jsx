import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getPublishedCourses, getMyCourses, enrollInCourse } from '../../api/learner';

export default function LearnerExplore() {
  const [published, setPublished] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);

  const load = () => {
    Promise.all([getPublishedCourses(), getMyCourses()])
      .then(([courses, myCourses]) => {
        setPublished(Array.isArray(courses) ? courses : []);
        const ids = new Set((Array.isArray(myCourses) ? myCourses : []).map((c) => c.id));
        setEnrolledIds(ids);
      })
      .catch(() => { setPublished([]); setEnrolledIds(new Set()); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleEnroll = async (courseId) => {
    setEnrollingId(courseId);
    try {
      await enrollInCourse(courseId);
      toast.success('Enrolled successfully');
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to enroll');
    } finally {
      setEnrollingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">All Courses</h1>
      <p className="text-gray-500 mb-6">Explore published courses. Enroll to start learning.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {published.filter((c) => c.image_url && c.image_url.trim()).map((course) => {
          const enrolled = enrolledIds.has(course.id);
          return (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-gray-200">
                <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">Course</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Instructor: {course.instructor_name}</p>
                {enrolled ? (
                  <Link
                    to="/learner/my-courses"
                    className="mt-4 block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Continue Learning
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleEnroll(course.id)}
                    disabled={enrollingId === course.id}
                    className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {enrollingId === course.id ? 'Enrolling...' : 'Enroll'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {published.length === 0 && !loading && (
        <p className="text-gray-500">No published courses available.</p>
      )}
    </div>
  );
}
