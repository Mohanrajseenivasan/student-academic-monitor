import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me')
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: () => api.get('/admin/students'),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getFaculty: () => api.get('/admin/faculty'),
  createFaculty: (data) => api.post('/admin/faculty', data),
  updateFaculty: (id, data) => api.put(`/admin/faculty/${id}`, data),
  deleteFaculty: (id) => api.delete(`/admin/faculty/${id}`),
  getSubjects: () => api.get('/admin/subjects'),
  createSubject: (data) => api.post('/admin/subjects', data),
  updateSubject: (id, data) => api.put(`/admin/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/admin/subjects/${id}`)
};

export const facultyAPI = {
  getDashboard: () => api.get('/faculty/dashboard'),
  getStudents: () => api.get('/faculty/students'),
  getSubjectStudents: (subjectId) => api.get(`/faculty/subjects/${subjectId}/students`),
  enterMarks: (data) => api.post('/faculty/marks', data),
  markAttendance: (data) => api.post('/faculty/attendance', data),
  bulkMarkAttendance: (data) => api.post('/faculty/attendance/bulk', data),
  getAttendanceReport: (params) => api.get('/faculty/attendance/report', { params })
};

export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  getSubjects: () => api.get('/student/subjects'),
  getMarks: (semester) => api.get(`/student/marks?semester=${semester}`),
  getAttendance: (params) => api.get('/student/attendance', { params }),
  getAnalytics: () => api.get('/student/analytics'),
  getNotifications: () => api.get('/student/notifications'),
  markNotificationRead: (id) => api.put(`/student/notifications/${id}/read`),
  submitFeedback: (data) => api.post('/student/feedback', data)
};

export default api;
