import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InstructorLayout from './components/InstructorLayout';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import Learners from './pages/Learners';
import Profile from './pages/Profile';
import LearnerLayout from './components/LearnerLayout';
import LearnerDashboard from './pages/learner/LearnerDashboard';
import LearnerMyCourses from './pages/learner/LearnerMyCourses';
import LearnerExplore from './pages/learner/LearnerExplore';
import LearnerProfile from './pages/learner/LearnerProfile';
import LearnerAchievements from './pages/learner/LearnerAchievements';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<InstructorLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="learners" element={<Learners />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/learner" element={<LearnerLayout />}>
          <Route index element={<LearnerDashboard />} />
          <Route path="my-courses" element={<LearnerMyCourses />} />
          <Route path="explore" element={<LearnerExplore />} />
          <Route path="profile" element={<LearnerProfile />} />
          <Route path="achievements" element={<LearnerAchievements />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
