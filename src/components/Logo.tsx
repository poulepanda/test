import { useTheme } from '../contexts/ThemeContext';

export default function Logo() {
  const { theme } = useTheme();
  
  const getLogoColors = () => {
    return theme === 'light' 
      ? { primary: '#1E40AF', secondary: '#3B82F6' }  // Dark blue & Blue
      : { primary: '#60A5FA', secondary: '#93C5FD' }; // Light blue & Lighter blue
  };

  const colors = getLogoColors();

  return (
    <div className="flex items-center gap-3">
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
          fill={colors.primary}
        />
        <path
          d="M2 23L16 30L30 23V9L16 16L2 9V23Z"
          fill={colors.secondary}
          fillOpacity="0.8"
        />
      </svg>
      <span className={`text-2xl font-bold ${
        theme === 'light' ? 'text-gray-800' : 'text-gray-100'
      }`}>
        TRADEX
      </span>
    </div>
  );
}