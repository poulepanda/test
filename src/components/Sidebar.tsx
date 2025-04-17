import { LayoutDashboard, Globe, LineChart, List, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Sidebar() {
  const { theme } = useTheme();
  const { logout } = useAuth();

  const getSidebarClasses = () => {
    return theme === 'light'
      ? 'bg-blue-50 border-r border-blue-100'
      : 'bg-gray-800';
  };

  const getLinkClasses = (isActive: boolean) => {
    if (theme === 'light') {
      return `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-600'
          : 'text-blue-700 hover:bg-blue-100 hover:text-blue-800'
      }`;
    }
    return `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-gray-700 text-gray-100'
        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
    }`;
  };

  return (
    <div className={`fixed top-0 left-0 w-64 h-screen flex flex-col ${getSidebarClasses()}`}>
      <div className="p-4">
        <div className="mb-8">
          <Logo />
        </div>
        <nav className="space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/site"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <Globe className="h-5 w-5" />
            <span>Site</span>
          </NavLink>
          <NavLink
            to="/trades"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <LineChart className="h-5 w-5" />
            <span>Trades</span>
          </NavLink>
          <NavLink
            to="/trades-list"
            className={({ isActive }) => getLinkClasses(isActive)}
          >
            <List className="h-5 w-5" />
            <span>Trades List</span>
          </NavLink>
        </nav>
      </div>
      <div className="mt-auto p-4 space-y-4">
        <ThemeToggle />
        <button
          onClick={logout}
          className={`flex items-center space-x-2 w-full px-4 py-2 rounded-lg transition-colors ${
            theme === 'light'
              ? 'text-red-600 hover:bg-red-50'
              : 'text-red-400 hover:bg-gray-700'
          }`}
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}