import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Table from '../../components/common/Table';

const facultyLinks = [
  { path: '/faculty/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/faculty/students', label: 'My Students', icon: '👨‍🎓' },
  { path: '/faculty/marks', label: 'Enter Marks', icon: '📝' },
  { path: '/faculty/attendance', label: 'Attendance', icon: '✅' },
];

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/faculty/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Name', accessor: (r) => r.userId?.name || 'N/A' },
    { header: 'Email', accessor: (r) => r.userId?.email || 'N/A' },
    { header: 'Department', accessor: 'department' },
    { header: 'Year', accessor: 'year' },
    { header: 'Section', accessor: 'section' },
    { header: 'CGPA', accessor: (r) => r.academicInfo?.currentCGPA || 'N/A' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="faculty" links={facultyLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Students</h1>
          
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <Table columns={columns} data={students} />
          )}
        </main>
      </div>
    </div>
  );
}

export default StudentList;
