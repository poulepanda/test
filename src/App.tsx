import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Site from './pages/Site';
import Trades from './pages/Trades';
import TradesList from './pages/TradesList';
import { useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { theme } = useTheme();
  
  const getThemeClasses = () => {
    return theme === 'light' 
      ? 'bg-gray-100 text-gray-700'
      : 'bg-gray-900 text-gray-100';
  };

  return (
    <div className={`flex min-h-screen ${getThemeClasses()}`}>
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/site" element={<Site />} />
          <Route path="/trades" element={<Trades />} />
          <Route path="/trades-list" element={<TradesList />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;