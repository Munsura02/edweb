import { Link, NavLink, Outlet } from 'react-router-dom';
import { HiOutlineSquares2X2, HiOutlineBookOpen, HiOutlineUsers, HiOutlineUser, HiOutlineArrowRightOnRectangle } from 'react-icons/hi2';

export default function InstructorLayout() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-100 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="font-semibold text-gray-800">EdWeb INSTRUCTOR</h1>
        </div>
        <nav className="flex-1 p-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2">Management</p>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <HiOutlineSquares2X2 className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <HiOutlineBookOpen className="w-5 h-5" />
            <span>My Courses</span>
          </NavLink>
          <NavLink
            to="/learners"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <HiOutlineUsers className="w-5 h-5" />
            <span>Learners</span>
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 ${isActive ? 'bg-purple-100 text-purple-700' : 'text-gray-700 hover:bg-gray-200'}`
            }
          >
            <HiOutlineUser className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 py-2 mt-4">Account</p>
          <button type="button" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-200 w-full">
            <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/learner" className="text-sm text-purple-600 hover:text-purple-700 font-medium shrink-0">Learner →</Link>
          <input
            type="search"
            placeholder="Search..."
            className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <div className="flex items-center gap-3">
            <button type="button" className="p-2 text-gray-500 hover:text-gray-700 relative">
              <span className="sr-only">Notifications</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <div className="text-right">
              <p className="font-medium text-gray-800">Instructor Doe</p>
              <p className="text-sm text-gray-500">Instructor</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-700 flex items-center justify-center text-white font-medium">ID</div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
