import { useState } from 'react';
import { LayoutDashboard, Globe, LineChart, List, LogOut, Menu, X, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

export default function Sidebar() {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg ${
          theme === 'light'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-700 text-gray-100'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-40
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-64 ${getSidebarClasses()} flex flex-col
      `}>
        {/* Logo and Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-8">
              <Logo />
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </NavLink>
              <NavLink
                to="/site"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
              >
                <Globe className="h-5 w-5" />
                <span>Site</span>
              </NavLink>
              <NavLink
                to="/trades"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
              >
                <LineChart className="h-5 w-5" />
                <span>Trades</span>
              </NavLink>
              <NavLink
                to="/trades-list"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
              >
                <List className="h-5 w-5" />
                <span>Trades List</span>
              </NavLink>
              <NavLink
                to="/bbchat"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare className="h-5 w-5" />
                <span>BBChat</span>
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Theme Toggle and Logout - Fixed at bottom on mobile */}
        <div className="p-4 border-t border-gray-700">
          <ThemeToggle />
          <button
            onClick={logout}
            className={`flex items-center space-x-2 w-full px-4 py-2 mt-4 rounded-lg transition-colors ${
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

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}