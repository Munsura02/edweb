import { useState, useEffect } from 'react';
import { HiOutlineEllipsisVertical, HiStar } from 'react-icons/hi2';
import { toast } from 'react-toastify';
import { createCourse, getCourses, publishCourse, draftCourse, deleteCourse } from '../api/courses';

const FILTERS = [
  { key: null, label: 'All Courses' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Drafts' },
];

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null); // null = all, 'draft' | 'published'; archived not in backend
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [creating, setCreating] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Fetch courses when filter changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCourses(filter)
      .then((data) => {
        if (!cancelled) setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(err.response?.data?.detail || 'Failed to load courses');
          setCourses([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [filter]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.warning('Enter a course title');
      return;
    }
    setCreating(true);
    try {
      await createCourse({ title: newTitle.trim(), image_url: newImageUrl.trim() || null });
      toast.success('Course created');
      setShowNewModal(false);
      setNewTitle('');
      setNewImageUrl('');
      const data = await getCourses(filter);
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (id) => {
    setMenuOpenId(null);
    try {
      const updated = await publishCourse(id);
      setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success('Course published');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to publish');
    }
  };

  const handleDraft = async (id) => {
    setMenuOpenId(null);
    try {
      const updated = await draftCourse(id);
      setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast.success('Course set to draft');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to set draft');
    }
  };

  const handleDelete = async (id) => {
    setMenuOpenId(null);
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success('Course deleted');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete course');
    }
  };

  // Hide courses with no image (frontend filter per spec)
  const visibleCourses = courses.filter((c) => c.image_url && c.image_url.trim() !== '');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">Manage your educational content and student engagements.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          <span>+</span>
          <span>New Course</span>
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {FILTERS.map(({ key, label }) => (
          <button
            key={key ?? 'all'}
            type="button"
            onClick={() => setFilter(key)}
            className={`px-4 py-2.5 text-sm font-medium rounded-t-lg -mb-px ${
              filter === key
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Course card */}
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center min-h-[220px] text-gray-500 hover:border-purple-400 hover:bg-purple-50/50 hover:text-purple-700 transition-colors"
          >
            <span className="text-4xl mb-2">+</span>
            <span className="font-medium">Create New Course</span>
            <span className="text-sm mt-1">Start building your next course.</span>
          </button>

          {/* Course cards from API (only show courses with image_url) */}
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-video bg-gray-200">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-medium rounded ${
                    course.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {course.status.toUpperCase()}
                </span>
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpenId(menuOpenId === course.id ? null : course.id)}
                      className="p-1.5 rounded hover:bg-white/80 text-gray-600"
                      aria-label="Options"
                    >
                      <HiOutlineEllipsisVertical className="w-5 h-5" />
                    </button>
                    {menuOpenId === course.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} aria-hidden />
                        <div className="absolute right-0 top-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[140px]">
                          {course.status === 'draft' ? (
                            <button
                              type="button"
                              onClick={() => handlePublish(course.id)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Publish
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleDraft(course.id)}
                              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Set to Draft
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDelete(course.id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-1.5 text-amber-600 mb-1">
                  <HiStar className="w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">{course.rating || '0'}</span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate" title={course.title}>{course.title}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Course modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">New Course</h2>
            <form onSubmit={handleCreateCourse}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Course title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
              />
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-6"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setShowNewModal(false); setNewTitle(''); setNewImageUrl(''); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
