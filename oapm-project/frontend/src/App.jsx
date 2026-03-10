import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageSubjects from './pages/admin/ManageSubjects';
import Analytics from './pages/admin/Analytics';
import FacultyDashboard from './pages/faculty/Dashboard';
import StudentList from './pages/faculty/StudentList';
import EnterMarks from './pages/faculty/EnterMarks';
import Attendance from './pages/faculty/Attendance';
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Subjects from './pages/student/Subjects';
import Marks from './pages/student/Marks';
import StudentAttendance from './pages/student/Attendance';
import StudentAnalytics from './pages/student/Analytics';
import Notifications from './pages/student/Notifications';
import Feedback from './pages/student/Feedback';

function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!user.token) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/admin" element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="students" element={<ManageStudents />} />
          <Route path="faculty" element={<ManageFaculty />} />
          <Route path="subjects" element={<ManageSubjects />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        <Route path="/faculty" element={
          <ProtectedRoute allowedRole="faculty">
            <FacultyDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/faculty/dashboard" />} />
          <Route path="dashboard" element={<FacultyDashboard />} />
          <Route path="students" element={<StudentList />} />
          <Route path="marks" element={<EnterMarks />} />
          <Route path="attendance" element={<Attendance />} />
        </Route>
        
        <Route path="/student" element={
          <ProtectedRoute allowedRole="student">
            <StudentDashboard darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/student/dashboard" />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="marks" element={<Marks />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="analytics" element={<StudentAnalytics />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="feedback" element={<Feedback />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
