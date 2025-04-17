import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserCircle2, KeyRound, AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';

export default function SignIn() {
  const { theme } = useTheme();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  // Create shooting stars
  const shootingStars = Array.from({ length: 20 }).map((_, i) => {
    const delay = Math.random() * 10;
    const duration = 1 + Math.random() * 2;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    
    return (
      <div
        key={i}
        className="shooting-star"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      />
    );
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with shooting stars */}
      <div className={`absolute inset-0 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 to-blue-100' 
          : 'bg-gradient-to-br from-gray-900 to-gray-800'
      }`}>
        {shootingStars}
      </div>

      {/* Sign In Form */}
      <div className={`relative z-10 max-w-md w-full mx-4 p-8 rounded-lg shadow-xl ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <h2 className={`text-2xl font-bold text-center mb-8 ${
          theme === 'light' ? 'text-blue-900' : 'text-white'
        }`}>
          Sign In to Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-blue-900' : 'text-gray-200'
            }`}>
              Username
            </label>
            <div className="relative">
              <UserCircle2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'light' ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 placeholder-blue-400'
                    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              theme === 'light' ? 'text-blue-900' : 'text-gray-200'
            }`}>
              Password
            </label>
            <div className="relative">
              <KeyRound className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'light' ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-blue-50 border border-blue-200 text-blue-900 placeholder-blue-400'
                    : 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className={`flex items-center gap-2 p-3 rounded-lg ${
              theme === 'light' ? 'bg-red-100 text-red-700' : 'bg-red-900 bg-opacity-50 text-red-400'
            }`}>
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              theme === 'light'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-blue-500 text-white hover:bg-blue-400'
            }`}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}