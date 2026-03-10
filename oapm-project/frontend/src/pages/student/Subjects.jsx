import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Table from '../../components/common/Table';

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

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/student/subjects', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubjects(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const columns = [
    { header: 'Subject Code', accessor: 'subjectCode' },
    { header: 'Subject Name', accessor: 'subjectName' },
    { header: 'Department', accessor: 'academicInfo.department' },
    { header: 'Year', accessor: 'academicInfo.year' },
    { header: 'Semester', accessor: 'academicInfo.semester' },
    { header: 'Credits', accessor: 'academicInfo.credits' },
    { header: 'Type', accessor: 'academicInfo.type' },
    { header: 'Faculty', accessor: (r) => r.faculty?.assignedFaculty?.name || 'Not Assigned' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Subjects</h1>
          
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <Table columns={columns} data={subjects} />
          )}
        </main>
      </div>
    </div>
  );
}

export default Subjects;
