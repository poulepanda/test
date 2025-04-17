import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 p-4">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-lg transition-colors ${
          theme === 'light'
            ? 'bg-blue-100 text-blue-600'
            : 'hover:bg-gray-700 text-gray-400'
        }`}
        title="Light Mode"
      >
        <Sun className="h-5 w-5" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-lg transition-colors ${
          theme === 'dark'
            ? 'bg-gray-700 text-gray-100'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Dark Mode"
      >
        <Moon className="h-5 w-5" />
      </button>
    </div>
  );
}