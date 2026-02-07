import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getMyCourses, updateProgress } from '../../api/learner';
import { HiOutlineAcademicCap } from 'react-icons/hi2';

const TOTAL_LESSONS = 20;
function lessonsFromProgress(progress) {
  const done = Math.round((progress / 100) * TOTAL_LESSONS);
  return { done: Math.min(done, TOTAL_LESSONS), total: TOTAL_LESSONS };
}

export default function LearnerMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMyCourses()
      .then((data) => { if (!cancelled) setCourses(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setCourses([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleContinue = async (courseId) => {
    try {
      await updateProgress(courseId);
      const data = await getMyCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update progress');
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h1>
      <p className="text-gray-500 mb-6">Your enrolled courses and progress.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const { done, total } = lessonsFromProgress(course.progress);
          return (
            <div key={course.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="relative aspect-video bg-gray-200">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
                {course.completed && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-purple-800 text-sm font-medium">
                      <HiOutlineAcademicCap className="w-4 h-4" />
                      Completed
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{course.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">Instructor: {course.instructor_name}</p>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>{course.progress}% Complete</span>
                    <span>{done}/{total}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleContinue(course.id)}
                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Continue Learning
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {courses.length === 0 && !loading && (
        <p className="text-gray-500">You have no enrolled courses yet.</p>
      )}
    </div>
  );
}
