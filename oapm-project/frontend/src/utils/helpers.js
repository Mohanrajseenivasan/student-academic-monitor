import { format, formatDistanceToNow, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, 'MMM dd, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return format(parsed, 'MMM dd, yyyy HH:mm');
};

export const timeAgo = (date) => {
  if (!date) return 'N/A';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsed, { addSuffix: true });
};

export const calculateGrade = (percentage) => {
  if (percentage >= 90) return { grade: 'A+', point: 10 };
  if (percentage >= 80) return { grade: 'A', point: 9 };
  if (percentage >= 70) return { grade: 'B+', point: 8 };
  if (percentage >= 60) return { grade: 'B', point: 7 };
  if (percentage >= 50) return { grade: 'C', point: 6 };
  if (percentage >= 40) return { grade: 'D', point: 5 };
  return { grade: 'F', point: 0 };
};

export const calculateCGPA = (marks) => {
  if (!marks || marks.length === 0) return 0;
  const totalPoints = marks.reduce((sum, m) => sum + (m.gradePoint || 0), 0);
  return (totalPoints / marks.length).toFixed(2);
};

export const getStatusColor = (status) => {
  const colors = {
    Present: 'bg-green-100 text-green-700',
    Absent: 'bg-red-100 text-red-700',
    Late: 'bg-yellow-100 text-yellow-700',
    OnDuty: 'bg-blue-100 text-blue-700',
    Medical: 'bg-purple-100 text-purple-700',
    Pass: 'bg-green-100 text-green-700',
    Fail: 'bg-red-100 text-red-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const generateId = (prefix = 'ID') => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};
