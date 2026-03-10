import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import StatCard from '../../components/common/StatCard';
import Table from '../../components/common/Table';

const facultyLinks = [
  { path: '/faculty/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/faculty/students', label: 'My Students', icon: '👨‍🎓' },
  { path: '/faculty/marks', label: 'Enter Marks', icon: '📝' },
  { path: '/faculty/attendance', label: 'Attendance', icon: '✅' },
];

function FacultyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/faculty/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (location.pathname === '/faculty') {
    navigate('/faculty/dashboard');
    return null;
  }

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Name', accessor: (r) => r.userId?.name || 'N/A' },
    { header: 'Subject', accessor: (r) => r.subjectId?.subjectName || 'N/A' },
    { header: 'Marks', accessor: (r) => r.marks?.totalMarks || 'N/A' },
    { header: 'Grade', accessor: (r) => r.marks?.grade || 'N/A' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="faculty" links={facultyLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Faculty Dashboard</h1>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>)}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard icon="📚" label="My Subjects" value={stats?.totalSubjects || 0} color="primary" />
                <StatCard icon="👨‍🎓" label="Total Students" value={stats?.totalStudents || 0} color="success" />
                <StatCard icon="📝" label="Marks Entered" value={stats?.recentMarks?.length || 0} color="warning" />
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">My Subjects</h3>
                {stats?.subjects?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.subjects.map(subject => (
                      <div key={subject._id} className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                        <h4 className="font-medium text-gray-900 dark:text-white">{subject.subjectName}</h4>
                        <p className="text-sm text-gray-500">{subject.subjectCode}</p>
                        <p className="text-sm text-gray-500">{subject.academicInfo?.department} - Sem {subject.academicInfo?.semester}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No subjects assigned yet.</p>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default FacultyDashboard;
