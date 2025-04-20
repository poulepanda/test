import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { User, Phone, Mail, MapPin, Building2, Globe2 } from 'lucide-react';

export default function Site() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    investmentAmount: '0'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([formData]);

      if (error) throw error;

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        investmentAmount: '0'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateInvestmentAmount = (value: string) => {
    const percentage = parseInt(value) / 100;
    let amount;
    
    if (percentage <= 0.4) {
      // Linear progression up to 40% (reaches 1,000)
      amount = percentage * (1000 / 0.4);
    } else {
      // Exponential progression after 40%
      const remainingPercentage = (percentage - 0.4) / 0.6; // Normalize remaining percentage
      amount = 1000 + Math.pow(remainingPercentage, 2) * 99000; // Exponential increase up to 100,000
    }
    
    // Round to nearest 100 if under 10,000, otherwise to nearest 1000
    if (amount < 10000) {
      return Math.round(amount / 100) * 100;
    }
    return Math.round(amount / 1000) * 1000;
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(calculateInvestmentAmount(amount));
  };

  const getSliderBackground = (value: string) => {
    const percentage = parseInt(value);
    const primaryColor = theme === 'light' ? '#0ea5e9' : '#3b82f6'; // sky-500 for light, blue-500 for dark
    const secondaryColor = theme === 'light' ? '#e0f2fe' : '#1f2937'; // sky-100 for light, gray-800 for dark
    
    return `linear-gradient(to right, ${primaryColor} ${percentage}%, ${secondaryColor} ${percentage}%)`;
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Contact Information
        </h1>
        
        <form onSubmit={handleSubmit} className={`${getCardClasses()} rounded-lg p-6 space-y-6`}>
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                First Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === 'light' ? 'text-sky-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                      : 'bg-gray-700 text-white placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="John"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Last Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === 'light' ? 'text-sky-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                      : 'bg-gray-700 text-white placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Email
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === 'light' ? 'text-sky-500' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                      : 'bg-gray-700 text-white placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Phone
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === 'light' ? 'text-sky-500' : 'text-gray-400'
                }`} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                      : 'bg-gray-700 text-white placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="+1 234 567 890"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Address
            </label>
            <div className="relative">
              <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                theme === 'light' ? 'text-sky-500' : 'text-gray-400'
              }`} />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                    : 'bg-gray-700 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="123 Trading Street"
              />
            </div>
          </div>

          {/* City and Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                City
              </label>
              <div className="relative">
                <Building2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === 'light' ? 'text-sky-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                      : 'bg-gray-700 text-white placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="New York"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Country
              </label>
              <div className="relative">
                <Globe2 className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                  theme === 'light' ? 'text-sky-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                      : 'bg-gray-700 text-white placeholder-gray-400'
                  } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  placeholder="United States"
                />
              </div>
            </div>
          </div>

          {/* Investment Amount Range */}
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Planned Investment Amount
            </label>
            <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-6 rounded-lg border ${
              theme === 'light' ? 'border-sky-200' : 'border-gray-600'
            }`}>
              <div className="mb-4">
                <span className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
                  ${formatCurrency(formData.investmentAmount)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData.investmentAmount}
                onChange={(e) => setFormData({ ...formData, investmentAmount: e.target.value })}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer`}
                style={{
                  background: getSliderBackground(formData.investmentAmount)
                }}
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>0</span>
                <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>100,000</span>
              </div>
            </div>
          </div>

          {success && (
            <div className="bg-green-500 bg-opacity-10 text-green-500 px-4 py-2 rounded-lg">
              Form submitted successfully!
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              } transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}