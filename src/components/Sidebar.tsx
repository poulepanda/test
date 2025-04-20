import { useState } from 'react';
import { Globe, LineChart, List, LogOut, Menu, X, ChevronLeft, ChevronRight, Users, BookOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { theme } = useTheme();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const getSidebarClasses = () => {
    return theme === 'light'
      ? 'bg-blue-100 border-r border-blue-200'
      : 'bg-gray-800';
  };

  const getLinkClasses = (isActive: boolean) => {
    if (theme === 'light') {
      return `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-200 text-blue-800'
          : 'text-blue-900 hover:bg-blue-200 hover:text-blue-900'
      }`;
    }
    return `flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-2 rounded-lg transition-colors ${
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
            ? 'bg-blue-200 text-blue-800'
            : 'bg-gray-700 text-gray-100'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-screen z-40
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        ${isCollapsed ? 'w-16' : 'w-64'} ${getSidebarClasses()} flex flex-col
      `}>
        {/* Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
            theme === 'light'
              ? 'bg-blue-200 text-blue-800 hover:bg-blue-300'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } hidden md:block`}
        >
          {isCollapsed ? 
            <ChevronRight className="h-4 w-4" /> : 
            <ChevronLeft className="h-4 w-4" />
          }
        </button>

        {/* Logo and Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="mb-8">
              {isCollapsed ? (
                <div className="flex justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="shrink-0"
                  >
                    <path
                      d="M16 2L2 9L16 16L30 9L16 2Z"
                      fill={theme === 'light' ? '#1E40AF' : '#60A5FA'}
                    />
                    <path
                      d="M2 23L16 30L30 23V9L16 16L2 9V23Z"
                      fill={theme === 'light' ? '#3B82F6' : '#93C5FD'}
                      fillOpacity="0.8"
                    />
                  </svg>
                </div>
              ) : (
                <Logo />
              )}
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
                title="About Trading"
              >
                <BookOpen className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>About Trading</span>}
              </NavLink>
              <NavLink
                to="/users"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
                title="Users"
              >
                <Users className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>Users</span>}
              </NavLink>
              <NavLink
                to="/site"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
                title="Site"
              >
                <Globe className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>Form</span>}
              </NavLink>
              <NavLink
                to="/trades"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
                title="Trades"
              >
                <LineChart className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>Trades</span>}
              </NavLink>
              <NavLink
                to="/trades-list"
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
                title="Trades List"
              >
                <List className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>Trades List</span>}
              </NavLink>
            </nav>
          </div>
        </div>

        {/* Theme Toggle and Logout */}
        <div className={`p-4 border-t ${theme === 'light' ? 'border-blue-200' : 'border-gray-700'}`}>
          {!isCollapsed && <ThemeToggle />}
          <button
            onClick={logout}
            className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'} w-full px-4 py-2 mt-4 rounded-lg transition-colors ${
              theme === 'light'
                ? 'text-red-700 hover:bg-red-50'
                : 'text-red-400 hover:bg-gray-700'
            }`}
            title="Logout"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
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