export default function Learners() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Learners</h1>
      <p className="text-gray-500 mt-1 mb-6">Track student progress and engagement across all created courses.</p>
      <div className="flex gap-2 mb-4">
        <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          Filter
        </button>
        <button type="button" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
          Message All
        </button>
      </div>
      <p className="text-sm text-gray-500">Learner dashboard will be implemented later.</p>
    </div>
  );
}
