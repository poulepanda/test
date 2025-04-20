import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { User, Phone, Mail, MapPin, Building2, Globe2, Bitcoin, DollarSign, Gem, Warehouse, Cpu, Briefcase, LineChart, Coins } from 'lucide-react';

type InvestmentType = 'bitcoin' | 'forex' | 'crypto' | 'commodities' | 'devices' | 'stocks' | 'indices' | 'metals';

export default function Site() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    profil: 'user',
    status: 'active',
    nb_lots: 0,
    balance: 0,
    invest: 0,
    investmentTypes: [] as InvestmentType[]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  const handleInvestmentTypeToggle = (type: InvestmentType) => {
    setFormData(prev => {
      const types = prev.investmentTypes.includes(type)
        ? prev.investmentTypes.filter(t => t !== type)
        : [...prev.investmentTypes, type];
      return { ...prev, investmentTypes: types };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setShowWelcome(false);

    try {
      const { error } = await supabase
        .from('users')
        .insert([{
          fname: formData.fname,
          lname: formData.lname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          profil: 'user',
          status: 'active',
          nb_lots: formData.nb_lots,
          balance: formData.balance,
          invest: formData.invest
        }]);

      if (error) {
        throw error;
      }

      setSuccess(true);
      setShowWelcome(true);
      
      // Reset form
      setFormData({
        fname: '',
        lname: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        profil: 'user',
        status: 'active',
        nb_lots: 0,
        balance: 0,
        invest: 0,
        investmentTypes: []
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
      amount = percentage * (1000 / 0.4);
    } else {
      const remainingPercentage = (percentage - 0.4) / 0.6;
      amount = 1000 + Math.pow(remainingPercentage, 2) * 99000;
    }
    
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
    const primaryColor = theme === 'light' ? '#0ea5e9' : '#3b82f6';
    const secondaryColor = theme === 'light' ? '#e0f2fe' : '#1f2937';
    
    return `linear-gradient(to right, ${primaryColor} ${percentage}%, ${secondaryColor} ${percentage}%)`;
  };

  const investmentTypes = [
    { id: 'bitcoin', icon: Bitcoin, label: 'Bitcoin' },
    { id: 'forex', icon: DollarSign, label: 'Forex' },
    { id: 'crypto', icon: Gem, label: 'Crypto' },
    { id: 'commodities', icon: Warehouse, label: 'Commodities' },
    { id: 'devices', icon: Cpu, label: 'Devices' },
    { id: 'stocks', icon: Briefcase, label: 'Stocks' },
    { id: 'indices', icon: LineChart, label: 'Indices' },
    { id: 'metals', icon: Coins, label: 'Metals' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className={`absolute inset-0 ${
        theme === 'light' 
          ? 'bg-gradient-to-br from-blue-50 via-sky-100 to-blue-100' 
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      }`}>
      </div>

      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className={`${getCardClasses()} p-8 rounded-lg max-w-md mx-4`}>
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
              Welcome to Our Trading Platform!
            </h2>
            <p className={`mb-6 ${theme === 'light' ? 'text-sky-800' : 'text-gray-300'}`}>
              Thank you for joining us! Your account has been created successfully. 
              Get ready to start your trading journey!
            </p>
            <button
              onClick={() => setShowWelcome(false)}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-sky-500 text-white hover:bg-sky-600'
                  : 'bg-blue-500 text-white hover:bg-blue-400'
              }`}
            >
              Let's Get Started!
            </button>
          </div>
        </div>
      )}

      <div className="relative p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            Contact Information
          </h1>
          
          <form onSubmit={handleSubmit} className={`${getCardClasses()} rounded-lg p-6 space-y-6 backdrop-blur-sm bg-opacity-90`}>
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
                    value={formData.fname}
                    onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
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
                    value={formData.lname}
                    onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
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

            {/* Investment Type Selection */}
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-3`}>
                Investment Types (Select Multiple)
              </label>
              <div className="flex flex-wrap gap-4">
                {investmentTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.investmentTypes.includes(type.id as InvestmentType);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInvestmentTypeToggle(type.id as InvestmentType)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
                        isSelected
                          ? theme === 'light'
                            ? 'bg-sky-500 text-white shadow-lg scale-105'
                            : 'bg-blue-500 text-white shadow-lg scale-105'
                          : theme === 'light'
                            ? 'bg-white text-sky-900 hover:bg-sky-100'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Investment Amount Range */}
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Investment Amount
              </label>
              <div className={`${theme === 'light' ? 'bg-white' : 'bg-gray-700'} p-6 rounded-lg border ${
                theme === 'light' ? 'border-sky-200' : 'border-gray-600'
              }`}>
                <div className="mb-4">
                  <span className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
                    $ {formatCurrency(formData.invest.toString())}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.invest}
                  onChange={(e) => setFormData({ ...formData, invest: parseInt(e.target.value) })}
                  className={`w-full h-2 rounded-lg appearance-none cursor-pointer`}
                  style={{
                    background: getSliderBackground(formData.invest.toString())
                  }}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>$0</span>
                  <span className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>$100,000</span>
                </div>
              </div>
            </div>

            {/* Number of Lots */}
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Number of Lots
              </label>
              <input
                type="number"
                value={formData.nb_lots}
                onChange={(e) => setFormData({ ...formData, nb_lots: parseInt(e.target.value) })}
                min="0"
                className={`w-full px-3 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-white border border-sky-200 text-sky-900'
                    : 'bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
            </div>

            {/* Balance */}
            <div>
              <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
                Balance
              </label>
              <input
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: parseInt(e.target.value) })}
                className={`w-full px-3 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-white border border-sky-200 text-sky-900'
                    : 'bg-gray-700 text-white'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
            </div>

            {success && (
              <div className="bg-green-500 bg-opacity-10 text-green-500 px-4 py-2 rounded-lg">
                Account created successfully!
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}