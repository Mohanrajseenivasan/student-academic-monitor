import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/student/profile', label: 'Profile', icon: '👤' },
  { path: '/student/subjects', label: 'Subjects', icon: '📚' },
  { path: '/student/marks', label: 'Marks', icon: '📝' },
  { path: '/student/attendance', label: 'Attendance', icon: '✅' },
  { path: '/student/analytics', label: 'Analytics', icon: '📈' },
  { path: '/student/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/student/feedback', label: 'Feedback', icon: '💬' },
];

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (location.pathname === '/student') {
    navigate('/student/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Dashboard</h1>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>)}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon="📊" label="Current CGPA" value={data?.cgpa || 0} color="primary" />
                <StatCard icon="✅" label="Attendance" value={`${data?.attendance || 0}%`} color="success" />
                <StatCard icon="📚" label="Subjects" value={data?.subjects?.length || 0} color="warning" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Marks</h3>
                  {data?.marks?.length > 0 ? (
                    <div className="space-y-3">
                      {data.marks.slice(0, 5).map((mark, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{mark.subjectId?.subjectName}</p>
                            <p className="text-sm text-gray-500">{mark.subjectId?.subjectCode}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-primary-600">{mark.calculated?.totalMarks}</p>
                            <p className="text-sm text-gray-500">{mark.calculated?.grade}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No marks available yet.</p>
                  )}
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notifications</h3>
                  {data?.notifications?.length > 0 ? (
                    <div className="space-y-3">
                      {data.notifications.map((notif, index) => (
                        <div key={index} className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                          <p className="font-medium text-gray-900 dark:text-white">{notif.content?.title}</p>
                          <p className="text-sm text-gray-500">{notif.content?.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No new notifications.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentDashboard;
