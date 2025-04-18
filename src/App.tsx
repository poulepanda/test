import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Site from './pages/Site';
import Trades from './pages/Trades';
import TradesList from './pages/TradesList';
import BBChat from './pages/BBChat';
import SignIn from './pages/SignIn';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  
  const getThemeClasses = () => {
    return theme === 'light' 
      ? 'bg-blue-50 text-blue-900'
      : 'bg-gray-900 text-gray-100';
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row">
                <Sidebar />
                <div className="flex-1 md:ml-64 w-full">
                  <Dashboard />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/site"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row">
                <Sidebar />
                <div className="flex-1 md:ml-64 w-full">
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
              <div className="flex flex-col md:flex-row">
                <Sidebar />
                <div className="flex-1 md:ml-64 w-full">
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
              <div className="flex flex-col md:flex-row">
                <Sidebar />
                <div className="flex-1 md:ml-64 w-full">
                  <TradesList />
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bbchat"
          element={
            <ProtectedRoute>
              <div className="flex flex-col md:flex-row">
                <Sidebar />
                <div className="flex-1 md:ml-64 w-full">
                  <BBChat />
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