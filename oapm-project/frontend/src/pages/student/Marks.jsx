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

function Marks() {
  const [marks, setMarks] = useState([]);
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/student/marks?semester=${semester}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMarks(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMarks();
  }, [semester]);

  const getGradeColor = (grade) => {
    if (grade?.startsWith('A')) return 'text-green-600 bg-green-50';
    if (grade?.startsWith('B')) return 'text-blue-600 bg-blue-50';
    if (grade === 'C') return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Marks</h1>
            <select 
              className="input w-40"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>
          
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : marks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marks.map((mark, index) => (
                <div key={index} className="card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{mark.subjectName}</h3>
                      <p className="text-sm text-gray-500">{mark.subjectCode}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(mark.calculated?.grade)}`}>
                      {mark.calculated?.grade}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mark.calculated?.totalMarks}
                      </p>
                      <p className="text-xs text-gray-500">Total Marks</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mark.calculated?.percentage}%
                      </p>
                      <p className="text-xs text-gray-500">Percentage</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Internal 1</span>
                      <span className="font-medium">{mark.assessments?.internal1?.marks || 0}/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Internal 2</span>
                      <span className="font-medium">{mark.assessments?.internal2?.marks || 0}/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Assignment</span>
                      <span className="font-medium">{mark.assessments?.assignment?.marks || 0}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Semester Exam</span>
                      <span className="font-medium">{mark.assessments?.semesterExam?.marks || 0}/50</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">No marks available for this semester.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Marks;
