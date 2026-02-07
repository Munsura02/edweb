export default function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      <p className="text-gray-500 mt-1 mb-6">Manage your instructor profile.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center text-2xl font-bold text-purple-700 mb-3">I</div>
            <h2 className="font-semibold text-gray-900">Instructor Doe</h2>
            <p className="text-sm text-gray-500">Senior Software Engineer</p>
            <p className="text-sm text-gray-600 mt-2">Passionate about teaching React and modern web development.</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">Profile form and save will be wired when needed.</p>
        </div>
      </div>
    </div>
  );
}
