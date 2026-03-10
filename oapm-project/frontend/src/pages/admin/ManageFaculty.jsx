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

function ManageFaculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', department: 'CSE', designation: 'Assistant Professor'
  });

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/admin/faculty', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFaculty(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/admin/faculty', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      fetchFaculty();
      setFormData({ name: '', email: '', department: 'CSE', designation: 'Assistant Professor' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/faculty/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFaculty();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const columns = [
    { header: 'Faculty ID', accessor: 'facultyId' },
    { header: 'Name', accessor: (r) => r.userId?.name || 'N/A' },
    { header: 'Email', accessor: (r) => r.userId?.email || 'N/A' },
    { header: 'Department', accessor: 'professionalInfo.department' },
    { header: 'Designation', accessor: 'professionalInfo.designation' },
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Faculty</h1>
            <button onClick={() => setShowModal(true)} className="btn btn-primary">Add Faculty</button>
          </div>

          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : (
            <Table columns={columns} data={faculty} />
          )}

          <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Faculty">
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
              <input type="text" placeholder="Designation" className="input" value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value})} />
              <button type="submit" className="btn btn-primary w-full">Add Faculty</button>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  );
}

export default ManageFaculty;
