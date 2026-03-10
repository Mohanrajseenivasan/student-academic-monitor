import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';

const facultyLinks = [
  { path: '/faculty/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/faculty/students', label: 'My Students', icon: '👨‍🎓' },
  { path: '/faculty/marks', label: 'Enter Marks', icon: '📝' },
  { path: '/faculty/attendance', label: 'Attendance', icon: '✅' },
];

function Attendance() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/faculty/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSubjects(data.subjects || []);
        if (data.subjects?.length > 0) {
          setSelectedSubject(data.subjects[0]._id);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedSubject) return;
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`/api/faculty/subjects/${selectedSubject}/students`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStudents(data);
        const initialData = {};
        data.forEach(s => {
          initialData[s._id] = 'Present';
        });
        setAttendanceData(initialData);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchStudents();
  }, [selectedSubject]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const records = students.map(student => ({
        studentId: student._id,
        status: attendanceData[student._id]
      }));

      await axios.post('/api/faculty/attendance/bulk', {
        subjectId: selectedSubject,
        date,
        records,
        academicYear: '2024-25',
        semester: 1
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Attendance saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving attendance');
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status) => {
    const newData = {};
    students.forEach(s => {
      newData[s._id] = status;
    });
    setAttendanceData(newData);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="faculty" links={facultyLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mark Attendance</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subject
              </label>
              <select 
                className="input"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject._id} value={subject._id}>
                    {subject.subjectName} ({subject.subjectCode})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Date
              </label>
              <input 
                type="date" 
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => markAll('Present')} className="btn bg-green-100 text-green-700 hover:bg-green-200">
                All Present
              </button>
              <button onClick={() => markAll('Absent')} className="btn bg-red-100 text-red-700 hover:bg-red-200">
                All Absent
              </button>
            </div>
          </div>

          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student._id}>
                        <td>{student.studentId}</td>
                        <td>{student.name || student.userId?.name}</td>
                        <td>
                          <select 
                            className={`input w-32 ${
                              attendanceData[student._id] === 'Present' ? 'bg-green-50 border-green-500' :
                              attendanceData[student._id] === 'Absent' ? 'bg-red-50 border-red-500' : ''
                            }`}
                            value={attendanceData[student._id] || 'Present'}
                            onChange={(e) => handleAttendanceChange(student._id, e.target.value)}
                          >
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Late">Late</option>
                            <option value="OnDuty">On Duty</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button 
                onClick={handleSaveAttendance}
                disabled={saving}
                className="btn btn-primary"
              >
                {saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Attendance;
