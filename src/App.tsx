import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Site from './pages/Site';
import Trades from './pages/Trades';

function App() {
  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/site" element={<Site />} />
          <Route path="/trades" element={<Trades />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;