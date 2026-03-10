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

function EnterMarks() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [marksData, setMarksData] = useState({});

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
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchStudents();
  }, [selectedSubject]);

  const handleMarksChange = (studentId, examType, value) => {
    setMarksData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [examType]: parseFloat(value) || 0
      }
    }));
  };

  const handleSaveMarks = async (studentId) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const marks = marksData[studentId] || {};
      await axios.post('/api/faculty/marks', {
        studentId,
        subjectId: selectedSubject,
        academicYear: '2024-25',
        semester: 1,
        assessments: {
          internal1: { marks: marks.internal1 || 0, maxMarks: 20 },
          internal2: { marks: marks.internal2 || 0, maxMarks: 20 },
          assignment: { marks: marks.assignment || 0, maxMarks: 10 },
          semesterExam: { marks: marks.semesterExam || 0, maxMarks: 50 }
        }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Marks saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Error saving marks');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="faculty" links={facultyLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Enter Marks</h1>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Subject
            </label>
            <select 
              className="input max-w-md"
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

          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Internal 1</th>
                    <th>Internal 2</th>
                    <th>Assignment</th>
                    <th>Semester Exam</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.name || student.userId?.name}</td>
                      <td>
                        <input 
                          type="number" 
                          className="input w-20"
                          max="20"
                          placeholder="0"
                          value={marksData[student._id]?.internal1 || ''}
                          onChange={(e) => handleMarksChange(student._id, 'internal1', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="input w-20"
                          max="20"
                          placeholder="0"
                          value={marksData[student._id]?.internal2 || ''}
                          onChange={(e) => handleMarksChange(student._id, 'internal2', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="input w-20"
                          max="10"
                          placeholder="0"
                          value={marksData[student._id]?.assignment || ''}
                          onChange={(e) => handleMarksChange(student._id, 'assignment', e.target.value)}
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          className="input w-20"
                          max="50"
                          placeholder="0"
                          value={marksData[student._id]?.semesterExam || ''}
                          onChange={(e) => handleMarksChange(student._id, 'semesterExam', e.target.value)}
                        />
                      </td>
                      <td>
                        <button 
                          onClick={() => handleSaveMarks(student._id)}
                          disabled={saving}
                          className="btn btn-primary text-sm"
                        >
                          {saving ? 'Saving...' : 'Save'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default EnterMarks;
