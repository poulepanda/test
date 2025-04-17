import { LayoutDashboard, Globe, LineChart, List } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

export default function Sidebar() {
  const { theme } = useTheme();

  const getSidebarClasses = () => {
    return theme === 'light'
      ? 'bg-white border-r border-gray-200'
      : 'bg-gray-800';
  };

  const getLinkClasses = (isActive: boolean) => {
    if (theme === 'light') {
      return `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-gray-100 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`;
    }
    return `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-gray-700 text-gray-100'
        : 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
    }`;
  };

  const getLogoClasses = () => {
    return theme === 'light' ? 'text-gray-700' : 'text-gray-100';
  };

  return (
    <div className={`w-64 min-h-screen p-4 ${getSidebarClasses()}`}>
      <div className={`text-2xl font-bold mb-8 ${getLogoClasses()}`}>LOGO</div>
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
      <div className="mt-auto">
        <ThemeToggle />
      </div>
    </div>
  );
}