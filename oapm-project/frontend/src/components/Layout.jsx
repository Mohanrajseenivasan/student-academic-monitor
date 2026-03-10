import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

function Layout({ darkMode, setDarkMode, links }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} user={user} />
      <div className="flex">
        <Sidebar role={user.role} links={links} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
