import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', department: 'CSE', year: 1, semester: 1, batch: '2024-2028', section: 'A'
  });
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/students', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchStudents();
      setFormData({ name: '', email: '', department: 'CSE', year: 1, semester: 1, batch: '2024-2028', section: 'A' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const columns = [
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Name', accessor: (r) => r.userId?.name || 'N/A' },
    { header: 'Email', accessor: (r) => r.userId?.email || 'N/A' },
    { header: 'Department', accessor: 'department' },
    { header: 'Year', accessor: 'year' },
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Students</h1>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Student</button>
          </div>

          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <Table columns={columns} data={students} />
          )}

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Student">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Name" className="input" value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="email" placeholder="Email" className="input" value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})} required />
              <select className="input" value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>
              <input type="number" placeholder="Year" className="input" min="1" max="4" value={formData.year}
                onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} />
              <button type="submit" className="btn btn-primary w-full">Add Student</button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}

export default ManageStudents;
