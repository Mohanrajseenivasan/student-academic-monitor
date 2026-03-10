import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/common/Sidebar';
import Navbar from '../../components/common/Navbar';
import BarChart from '../../components/charts/BarChart';
import PieChart from '../../components/charts/PieChart';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/students', label: 'Manage Students', icon: '👨‍🎓' },
  { path: '/admin/faculty', label: 'Manage Faculty', icon: '👨‍🏫' },
  { path: '/admin/subjects', label: 'Manage Subjects', icon: '📚' },
  { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

function Analytics() {
  const [loading, setLoading] = useState(true);

  const sampleData = {
    departmentPerformance: [
      { name: 'CSE', marks: 78, attendance: 85 },
      { name: 'ECE', marks: 75, attendance: 82 },
      { name: 'MECH', marks: 72, attendance: 80 },
      { name: 'CIVIL', marks: 70, attendance: 78 },
    ],
    yearWise: [
      { year: 'I Year', students: 750, avgCGPA: 8.2 },
      { year: 'II Year', students: 700, avgCGPA: 7.8 },
      { year: 'III Year', students: 650, avgCGPA: 7.5 },
      { year: 'IV Year', students: 600, avgCGPA: 7.9 },
    ],
    gradeDistribution: [
      { name: 'A+', value: 15 },
      { name: 'A', value: 25 },
      { name: 'B+', value: 30 },
      { name: 'B', value: 20 },
      { name: 'C', value: 7 },
      { name: 'F', value: 3 },
    ]
  };

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar role="admin" links={adminLinks} />
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Analytics</h1>

          {loading ? (
            <div className="animate-pulse space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
                <div className="h-80 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart 
                  data={sampleData.departmentPerformance} 
                  xKey="name" 
                  bars={[
                    { dataKey: 'marks', color: '#3b82f6' },
                    { dataKey: 'attendance', color: '#22c55e' }
                  ]}
                  title="Department Performance"
                />
                <PieChart 
                  data={sampleData.gradeDistribution} 
                  nameKey="name" 
                  valueKey="value"
                  title="Grade Distribution"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart 
                  data={sampleData.yearWise} 
                  xKey="year" 
                  bars={[
                    { dataKey: 'students', color: '#8b5cf6' },
                    { dataKey: 'avgCGPA', color: '#f59e0b' }
                  ]}
                  title="Year-wise Students & Avg CGPA"
                />
                
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Key Insights</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <p className="font-medium text-primary-700 dark:text-primary-300">Top Performing Department</p>
                      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">CSE</p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="font-medium text-green-700 dark:text-green-300">Highest Attendance</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">85%</p>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="font-medium text-yellow-700 dark:text-yellow-300">Need Attention</p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">15 Students</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default Analytics;
