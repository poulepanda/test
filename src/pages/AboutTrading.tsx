import { useTheme } from '../contexts/ThemeContext';
import { Lightbulb, TrendingUp, Shield, BookOpen, DollarSign, AlertTriangle, Rocket, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutTrading() {
  const { theme } = useTheme();

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Market Access",
      description: "Trade global markets including stocks, forex, cryptocurrencies, and commodities"
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Educational Resources",
      description: "Access comprehensive learning materials, webinars, and market analysis"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Platform",
      description: "Advanced security measures to protect your investments and personal data"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Expert Support",
      description: "24/7 customer support and professional trading guidance"
    }
  ];

  const steps = [
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Create Your Account",
      description: "Sign up and complete your verification process"
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Learn the Basics",
      description: "Complete our beginner-friendly trading courses"
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Start Trading",
      description: "Begin with a demo account before trading real funds"
    }
  ];

  return (
    <div className="p-6">
      {/* Hero Section */}
      <div className={`${getCardClasses()} rounded-lg p-8 mb-8`}>
        <h1 className={`text-3xl font-bold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Start Your Trading Journey
        </h1>
        <p className={`text-lg mb-6 ${theme === 'light' ? 'text-sky-800' : 'text-gray-300'}`}>
          Discover the world of trading with our comprehensive platform designed for both beginners and experienced traders.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800"
            alt="Trading Dashboard"
            className="rounded-lg shadow-lg"
          />
          <div className="space-y-4">
            <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
              Why Choose Our Platform?
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-sky-500' : 'bg-blue-500'}`}></span>
                <span className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>Advanced trading tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-sky-500' : 'bg-blue-500'}`}></span>
                <span className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>Real-time market data</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-sky-500' : 'bg-blue-500'}`}></span>
                <span className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>Professional analysis tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-sky-500' : 'bg-blue-500'}`}></span>
                <span className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>Competitive spreads</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className={`${getCardClasses()} rounded-lg p-8 mb-8`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Platform Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className={`${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-6 rounded-lg shadow-sm`}>
              <div className={`${theme === 'light' ? 'text-sky-600' : 'text-blue-400'} mb-4`}>
                {feature.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
                {feature.title}
              </h3>
              <p className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Getting Started Steps */}
      <div className={`${getCardClasses()} rounded-lg p-8 mb-8`}>
        <h2 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`${
                theme === 'light' ? 'bg-sky-100 text-sky-600' : 'bg-blue-500 bg-opacity-20 text-blue-400'
              } p-3 rounded-full`}>
                {step.icon}
              </div>
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
                  {step.title}
                </h3>
                <p className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warning */}
      <div className={`${getCardClasses()} rounded-lg p-8 mb-8`}>
        <div className="flex items-start space-x-4">
          <div className={`${
            theme === 'light' ? 'text-amber-600' : 'text-amber-500'
          } mt-1`}>
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
              Risk Warning
            </h2>
            <p className={`mb-4 ${theme === 'light' ? 'text-sky-800' : 'text-gray-300'}`}>
              Trading carries a high level of risk and may not be suitable for all investors. Before deciding to trade, please ensure that you:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>
                Understand the risks involved
              </li>
              <li className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>
                Consider your investment objectives and experience level
              </li>
              <li className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>
                Only risk capital you can afford to lose
              </li>
            </ul>
            <p className={theme === 'light' ? 'text-sky-800' : 'text-gray-300'}>
              Past performance is not indicative of future results. The value of investments can go down as well as up.
            </p>
          </div>
        </div>
      </div>

      {/* Get Started Button */}
      <div className="flex justify-center">
        <Link
          to="/site"
          className={`
            inline-flex items-center px-8 py-4 rounded-lg text-lg font-semibold
            transform transition-all duration-200 hover:scale-105
            ${theme === 'light'
              ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-lg hover:shadow-xl'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl'
            }
          `}
        >
          Get Started Now
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}