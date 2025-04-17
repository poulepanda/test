import { LayoutDashboard, Globe, LineChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="bg-gray-800 w-64 min-h-screen p-4">
      <div className="text-white text-2xl font-bold mb-8">LOGO</div>
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/site"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <Globe className="h-5 w-5" />
          <span>Site</span>
        </NavLink>
        <NavLink
          to="/trades"
          className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              isActive ? 'bg-gray-700 text-white' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            }`
          }
        >
          <LineChart className="h-5 w-5" />
          <span>Trades</span>
        </NavLink>
      </nav>
    </div>
  );
}