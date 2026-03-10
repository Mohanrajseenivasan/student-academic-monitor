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

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/student/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/student/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, status: { ...n.status, isRead: true } } : n
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getCategoryColor = (category) => {
    if (category === 'Alert') return 'bg-red-100 text-red-700';
    if (category === 'Warning') return 'bg-yellow-100 text-yellow-700';
    if (category === 'Success') return 'bg-green-100 text-green-700';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h1>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>)}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`card ${!notification.status?.isRead ? 'border-l-4 border-l-primary-500' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(notification.content?.category)}`}>
                          {notification.content?.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{notification.content?.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">{notification.content?.message}</p>
                    </div>
                    {!notification.status?.isRead && (
                      <button 
                        onClick={() => markAsRead(notification._id)}
                        className="text-sm text-primary-600 hover:text-primary-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-500">No notifications yet.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Notifications;
