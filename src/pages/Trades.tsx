import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import type { Trade } from '../types/trade';
import TradingViewWidget from '../components/TradingViewWidget';
import { useTheme } from '../contexts/ThemeContext';

export default function Trades() {
  const { theme } = useTheme();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [devices, setDevices] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [lot, setLot] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  useEffect(() => {
    fetchTrades();
  }, [selectedDevice, clientId, lot]);

  async function fetchTrades() {
    try {
      let query = supabase
        .from('Trades')
        .select('*')
        .order('created_at', { ascending: true });

      if (selectedDevice) {
        query = query.eq('device', selectedDevice);
      }
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      if (lot > 0) {
        query = query.eq('lot', lot);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data) {
        setTrades(data);
        const uniqueDevices = Array.from(new Set(data.map(trade => trade.device))).filter(Boolean);
        setDevices(uniqueDevices);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  }

  const saveTrade = async () => {
    if (!lot || !clientId) {
      alert('Please enter both Client ID and Lot Size');
      return;
    }

    setSaveLoading(true);
    setStatus('idle');

    try {
      const { error } = await supabase
        .from('Trades')
        .insert([
          {
            client_id: clientId,
            device: 'web',
            status: 'pending',
            lot: lot,
            balance: balance
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
      await fetchTrades();
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving trade:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return theme === 'light' ? 'bg-green-100 text-green-800' : 'bg-green-500 bg-opacity-10 text-green-500';
      case 'close':
        return theme === 'light' ? 'bg-red-100 text-red-800' : 'bg-red-500 bg-opacity-10 text-red-500';
      default:
        return theme === 'light' ? 'bg-yellow-100 text-yellow-800' : 'bg-yellow-500 bg-opacity-10 text-yellow-500';
    }
  };

  const chartData = trades.map(trade => ({
    time: new Date(trade.created_at).toLocaleTimeString(),
    lot: trade.lot,
    status: trade.status,
    balance: trade.balance
  }));

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Trading Analysis
        </h1>
        
        {/* Filters */}
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${getCardClasses()} p-6 rounded-lg`}>
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Device
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900'
                  : 'bg-gray-700 text-white'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
            >
              <option value="">All Devices</option>
              {devices.map(device => (
                <option key={device} value={device}>{device}</option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                  : 'bg-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter Client ID"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Balance
            </label>
            <input
              type="number"
              value={balance || ''}
              onChange={(e) => setBalance(Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                  : 'bg-gray-700 text-white placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              placeholder="Enter Balance"
              step="0.01"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Lot Size
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={lot || ''}
                onChange={(e) => setLot(Number(e.target.value))}
                className={`flex-1 px-3 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                    : 'bg-gray-700 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
                placeholder="Enter Lot Size"
                min="0"
                step="0.01"
              />
              <div className="flex items-center gap-2">
                {status === 'success' && (
                  <span className="bg-green-500 bg-opacity-10 text-green-500 px-3 py-1 rounded-md text-sm whitespace-nowrap">
                    Trade saved!
                  </span>
                )}
                {status === 'error' && (
                  <span className="bg-red-500 bg-opacity-10 text-red-500 px-3 py-1 rounded-md text-sm whitespace-nowrap">
                    Error saving trade
                  </span>
                )}
                <button
                  onClick={saveTrade}
                  disabled={saveLoading}
                  className={`px-4 py-2 rounded-lg ${
                    theme === 'light'
                      ? 'bg-sky-500 text-white hover:bg-sky-600'
                      : 'bg-blue-500 text-white hover:bg-blue-400'
                  } transition-colors whitespace-nowrap ${
                    saveLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {saveLoading ? 'Saving...' : 'Save Trade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TradingView Widget */}
      <div className={`${getCardClasses()} p-6 rounded-lg mb-8`}>
        <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Market Chart
        </h2>
        <div className="h-[600px] w-full">
          <TradingViewWidget />
        </div>
      </div>

      {/* Trading Performance Chart */}
      <div className={`${getCardClasses()} p-6 rounded-lg`}>
        <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Trading Performance
        </h2>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : trades.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No trading data available</div>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={theme === 'light' ? '#e2e8f0' : '#374151'} 
                />
                <XAxis 
                  dataKey="time" 
                  stroke={theme === 'light' ? '#64748b' : '#9CA3AF'}
                  tick={{ fill: theme === 'light' ? '#64748b' : '#9CA3AF' }}
                />
                <YAxis 
                  stroke={theme === 'light' ? '#64748b' : '#9CA3AF'}
                  tick={{ fill: theme === 'light' ? '#64748b' : '#9CA3AF' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'light' ? '#ffffff' : '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: theme === 'light' ? '#1f2937' : '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="lot" 
                  stroke={theme === 'light' ? '#0284c7' : '#3B82F6'} 
                  strokeWidth={2}
                  dot={{ fill: theme === 'light' ? '#0284c7' : '#3B82F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke={theme === 'light' ? '#059669' : '#10B981'} 
                  strokeWidth={2}
                  dot={{ fill: theme === 'light' ? '#059669' : '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Trades Table */}
      <div className={`mt-8 ${getCardClasses()} rounded-lg overflow-hidden`}>
        <div className="p-6">
          <h2 className={`text-xl font-bold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            Recent Trades
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={theme === 'light' ? 'bg-sky-100' : 'bg-gray-700'}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Date
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Client ID
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Device
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Status
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Lot
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${
                  theme === 'light' ? 'text-sky-900' : 'text-gray-300'
                } uppercase tracking-wider`}>
                  Balance
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === 'light' ? 'divide-sky-200' : 'divide-gray-700'}`}>
              {trades.map((trade) => (
                <tr key={trade.id} className={theme === 'light' ? 'hover:bg-sky-50' : 'hover:bg-gray-700'}>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    theme === 'light' ? 'text-sky-900' : 'text-white'
                  }`}>
                    {new Date(trade.created_at).toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    theme === 'light' ? 'text-sky-900' : 'text-white'
                  }`}>
                    {trade.client_id}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    theme === 'light' ? 'text-sky-900' : 'text-white'
                  }`}>
                    {trade.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(trade.status)}`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    theme === 'light' ? 'text-sky-900' : 'text-white'
                  }`}>
                    {trade.lot}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap ${
                    theme === 'light' ? 'text-sky-900' : 'text-white'
                  }`}>
                    {trade.balance !== null ? trade.balance.toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}