import { useState } from 'react';
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

function Feedback() {
  const [formData, setFormData] = useState({
    facultyId: '',
    subjectId: '',
    isAnonymous: false,
    ratings: {
      teaching: 5,
      communication: 5,
      knowledge: 5,
      availability: 5,
      fairness: 5
    },
    qualitative: {
      strengths: '',
      improvements: '',
      additionalComments: ''
    }
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/student/feedback', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
      setFormData({
        facultyId: '',
        subjectId: '',
        isAnonymous: false,
        ratings: { teaching: 5, communication: 5, knowledge: 5, availability: 5, fairness: 5 },
        qualitative: { strengths: '', improvements: '', additionalComments: '' }
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = (category) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setFormData({
            ...formData,
            ratings: { ...formData.ratings, [category]: star }
          })}
          className={`text-2xl ${star <= formData.ratings[category] ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="student" links={studentLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit Feedback</h1>
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg">
              Feedback submitted successfully! Thank you for your feedback.
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-2xl">
            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-">Rate Your Experience</h3>
              <div class900 dark:text-whiteName="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Faculty (Optional)
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Enter Faculty Name"
                    value={formData.facultyId}
                    onChange={(e) => setFormData({...formData, facultyId: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject (Optional)
                  </label>
                  <input 
                    type="text" 
                    className="input" 
                    placeholder="Enter Subject Name"
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {['teaching', 'communication', 'knowledge', 'availability', 'fairness'].map(category => (
                  <div key={category} className="flex justify-between items-center">
                    <label className="text-gray-700 dark:text-gray-300 capitalize">{category}</label>
                    {renderStarRating(category)}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Submit anonymously</span>
                </label>
              </div>
            </div>

            <div className="card mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Additional Comments</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What does the faculty do well?
                  </label>
                  <textarea 
                    className="input" 
                    rows="3"
                    value={formData.qualitative.strengths}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualitative: {...formData.qualitative, strengths: e.target.value}
                    })}
                    placeholder="Strengths..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    What can be improved?
                  </label>
                  <textarea 
                    className="input" 
                    rows="3"
                    value={formData.qualitative.improvements}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualitative: {...formData.qualitative, improvements: e.target.value}
                    })}
                    placeholder="Areas for improvement..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Comments
                  </label>
                  <textarea 
                    className="input" 
                    rows="3"
                    value={formData.qualitative.additionalComments}
                    onChange={(e) => setFormData({
                      ...formData,
                      qualitative: {...formData.qualitative, additionalComments: e.target.value}
                    })}
                    placeholder="Any other feedback..."
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="btn btn-primary w-full"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default Feedback;
