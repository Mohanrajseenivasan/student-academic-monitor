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

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/student/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>
          
          {loading ? (
            <div className="animate-pulse h-96 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          ) : profile ? (
            <div className="max-w-2xl">
              <div className="card mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                      {profile.userId?.name?.charAt(0) || 'S'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.userId?.name}</h2>
                    <p className="text-gray-500">{profile.studentId}</p>
                    <p className="text-gray-500">{profile.userId?.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Academic Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Year</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Semester</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Section</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.section || 'A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Batch</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.batch}</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current CGPA</span>
                      <span className="font-medium text-primary-600">{profile.academicInfo?.currentCGPA}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rank</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.academicInfo?.rank || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Backlogs</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.academicInfo?.backlogs || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Attendance</span>
                      <span className="font-medium text-green-600">{profile.attendanceStats?.overallPercentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Parent Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Father Name</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.parentInfo?.fatherName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mother Name</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.parentInfo?.motherName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Guardian Contact</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.parentInfo?.guardianContact || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone</span>
                      <span className="font-medium text-gray-900 dark:text-white">{profile.personalInfo?.contactNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Address</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {profile.personalInfo?.address?.city || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No profile data available.</p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Profile;
