import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/common/Navbar';
import Sidebar from '../../components/common/Sidebar';
import StatCard from '../../components/common/StatCard';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/students', label: 'Manage Students', icon: '👨‍🎓' },
  { path: '/admin/faculty', label: 'Manage Faculty', icon: '👨‍🏫' },
  { path: '/admin/subjects', label: 'Manage Subjects', icon: '📚' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (location.pathname === '/admin') {
    navigate('/admin/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" links={adminLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>)}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard icon="👨‍🎓" label="Total Students" value={stats?.totalStudents || 0} color="primary" />
                <StatCard icon="👨‍🏫" label="Total Faculty" value={stats?.totalFaculty || 0} color="success" />
                <StatCard icon="📚" label="Total Subjects" value={stats?.totalSubjects || 0} color="warning" />
                <StatCard icon="📊" label="Avg CGPA" value={stats?.avgCGPA || 0} color="primary" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => navigate('/admin/students')} className="btn btn-primary w-full">Manage Students</button>
                    <button onClick={() => navigate('/admin/faculty')} className="btn btn-secondary w-full">Manage Faculty</button>
                    <button onClick={() => navigate('/admin/subjects')} className="btn btn-secondary w-full">Manage Subjects</button>
                  </div>
                </div>
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Alerts</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-700 dark:text-yellow-400 text-sm">
                      {stats?.lowAttendanceCount || 0} students with low attendance
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-700 dark:text-blue-400 text-sm">
                      System running smoothly
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
