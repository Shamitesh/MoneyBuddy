// AppRouter.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import Reports from './pages/Reports';
import ChangePassword from './pages/ChangePassword';
import EditProfile from './pages/EditProfile';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/dashboard" element={<DashboardPage />} />  {/* Default route */}
    </Routes>
  </Router>
);

export default AppRouter;
