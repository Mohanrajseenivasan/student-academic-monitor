import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/students', label: 'Manage Students', icon: '👨‍🎓' },
  { path: '/admin/faculty', label: 'Manage Faculty', icon: '👨‍🏫' },
  { path: '/admin/subjects', label: 'Manage Subjects', icon: '📚' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

function ManageSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectName: '', subjectCode: '', department: 'CSE', year: 1, semester: 1, credits: 3, type: 'Theory'
  });

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/admin/subjects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubjects(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSubjects(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/subjects', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchSubjects();
      setFormData({ subjectName: '', subjectCode: '', department: 'CSE', year: 1, semester: 1, credits: 3, type: 'Theory' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSubjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const columns = [
    { header: 'Subject ID', accessor: 'subjectId' },
    { header: 'Subject Code', accessor: 'subjectCode' },
    { header: 'Subject Name', accessor: 'subjectName' },
    { header: 'Department', accessor: 'academicInfo.department' },
    { header: 'Year', accessor: 'academicInfo.year' },
    { header: 'Semester', accessor: 'academicInfo.semester' },
    { header: 'Credits', accessor: 'academicInfo.credits' },
    { header: 'Actions', accessor: (r) => (
      <button onClick={() => handleDelete(r._id)} className="text-red-600 hover:text-red-800">Delete</button>
    )}
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" links={adminLinks} />
        <main className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Subjects</h1>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Subject</button>
          </div>

          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <Table columns={columns} data={subjects} />
          )}

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Subject">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Subject Name" className="input" value={formData.subjectName}
                onChange={e => setFormData({...formData, subjectName: e.target.value})} required />
              <input type="text" placeholder="Subject Code" className="input" value={formData.subjectCode}
                onChange={e => setFormData({...formData, subjectCode: e.target.value})} required />
              <select className="input" value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Year" className="input" min="1" max="4" value={formData.year}
                  onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
                <input type="number" placeholder="Semester" className="input" min="1" max="8" value={formData.semester}
                  onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} />
              </div>
              <input type="number" placeholder="Credits" className="input" min="1" max="6" value={formData.credits}
                onChange={e => setFormData({...formData, credits: parseInt(e.target.value)})} />
              <button type="submit" className="btn btn-primary w-full">Add Subject</button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}

export default ManageSubjects;
