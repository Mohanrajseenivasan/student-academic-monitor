import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import LineChart from '../../components/charts/LineChart';
import BarChart from '../../components/charts/BarChart';
import RadarChart from '../../components/charts/RadarChart';

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

function StudentAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/student/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAnalytics(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const marksData = analytics?.marksTrend?.map(m => ({
    semester: `Sem ${m.semester}`,
    marks: m.percentage
  })) || [];

  const radarData = analytics?.marksTrend?.slice(0, 6).map(m => ({
    subject: m.subject?.substring(0, 8) || 'Subject',
    marks: m.percentage
  })) || [];

  const attendanceData = analytics?.attendanceTrend?.map(a => ({
    month: a.month,
    attendance: parseFloat(a.percentage)
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Analytics</h1>
          
          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card text-center">
                  <p className="text-3xl font-bold text-primary-600">{analytics?.cgpa || 0}</p>
                  <p className="text-gray-500">Current CGPA</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-green-600">#{analytics?.rank || 'N/A'}</p>
                  <p className="text-gray-500">Rank</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-yellow-600">{analytics?.backlogs || 0}</p>
                  <p className="text-gray-500">Backlogs</p>
                </div>
                <div className="card text-center">
                  <p className="text-3xl font-bold text-blue-600">{marksData.length}</p>
                  <p className="text-gray-500">Subjects Completed</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <LineChart 
                  data={marksData} 
                  xKey="semester" 
                  lines={[{ dataKey: 'marks', color: '#3b82f6' }]}
                  title="Marks Trend"
                />
                <LineChart 
                  data={attendanceData} 
                  xKey="month" 
                  lines={[{ dataKey: 'attendance', color: '#22c55e' }]}
                  title="Attendance Trend"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {radarData.length > 0 && (
                  <RadarChart data={radarData} title="Subject Performance" />
                )}
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <span className="text-gray-500">Performance Level</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        (analytics?.cgpa || 0) >= 8 ? 'bg-green-100 text-green-700' :
                        (analytics?.cgpa || 0) >= 6 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {(analytics?.cgpa || 0) >= 8 ? 'Excellent' : 
                         (analytics?.cgpa || 0) >= 6 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Keep up the good work! {(analytics?.cgpa || 0) >= 8 
                          ? 'You are performing excellently.' 
                          : 'Focus on improving your grades.'}
                      </p>
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

export default StudentAnalytics;
