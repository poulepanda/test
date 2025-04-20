import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Site from './pages/Site';
import Trades from './pages/Trades';
import TradesList from './pages/TradesList';
import Users from './pages/Users';
import AboutTrading from './pages/AboutTrading';
import SignIn from './pages/SignIn';
import { useTheme } from './contexts/ThemeContext';
import { useState } from 'react';

function AppContent() {
  const { theme } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const getThemeClasses = () => {
    return theme === 'light' 
      ? 'bg-blue-50 text-blue-900'
      : 'bg-gray-900 text-gray-100';
  };

  const getLayoutClasses = (isCollapsed: boolean) => {
    return `flex-1 min-h-screen w-full transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} ${getThemeClasses()}`;
  };

  return (
    <div className={`min-h-screen flex flex-col ${getThemeClasses()}`}>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className={getLayoutClasses(isCollapsed)}>
                  <AboutTrading />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className={getLayoutClasses(isCollapsed)}>
                  <Users />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/site"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className={getLayoutClasses(isCollapsed)}>
                  <Site />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trades"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className={getLayoutClasses(isCollapsed)}>
                  <Trades />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/trades-list"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row min-h-screen">
                <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                <div className={getLayoutClasses(isCollapsed)}>
                  <TradesList />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;