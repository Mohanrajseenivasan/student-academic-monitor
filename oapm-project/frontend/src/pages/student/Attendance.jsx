import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

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

function StudentAttendance() {
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/student/attendance', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAttendance(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Present') return 'bg-green-100 text-green-700';
    if (status === 'Absent') return 'bg-red-100 text-red-700';
    if (status === 'Late') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Attendance</h1>
          
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card text-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{attendance?.summary?.total || 0}</p>
                  <p className="text-gray-500">Total Classes</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-green-600">{attendance?.summary?.present || 0}</p>
                  <p className="text-gray-500">Present</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-red-600">{attendance?.summary?.absent || 0}</p>
                  <p className="text-gray-500">Absent</p>
                </div>
                <div className="card text-center">
                  <p className={`text-3xl font-bold ${(attendance?.summary?.percentage || 0) < 75 ? 'text-red-600' : 'text-green-600'}`}>
                    {attendance?.summary?.percentage || 0}%
                  </p>
                  <p className="text-gray-500">Percentage</p>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Attendance Records</h3>
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Subject</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance?.attendance?.slice(0, 20).map((record, index) => (
                        <tr key={index}>
                          <td>{new Date(record.details?.date).toLocaleDateString()}</td>
                          <td>{record.subjectId?.subjectName || 'N/A'}</td>
                          <td>
                            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(record.details?.status)}`}>
                              {record.details?.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentAttendance;
