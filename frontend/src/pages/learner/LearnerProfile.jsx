// Static UI only – no backend logic required.
export default function LearnerProfile() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 mb-3">L</div>
            <h2 className="font-semibold text-gray-900">Learner User</h2>
            <p className="text-sm text-gray-500">Student Account</p>
            <button type="button" className="text-sm text-purple-600 hover:underline mt-2">Change Avatar</button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" defaultValue="Learner User" className="w-full px-4 py-2 border border-gray-300 rounded-lg" readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" defaultValue="learner@edweb.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg" readOnly />
            </div>
            <button type="button" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span className="text-gray-500">🔒</span> Password
          </h3>
          <p className="text-sm text-gray-500 mt-1">Last changed 3 months ago.</p>
          <button type="button" className="text-sm text-purple-600 hover:underline mt-2">Update Password</button>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-medium text-gray-900 flex items-center gap-2">
            <span className="text-gray-500">📱</span> Sessions
          </h3>
          <p className="text-sm text-gray-500 mt-1">2 active sessions detected.</p>
          <button type="button" className="text-sm text-purple-600 hover:underline mt-2">Manage Devices</button>
        </div>
      </div>
    </div>
  );
}
