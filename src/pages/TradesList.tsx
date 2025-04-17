import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Trade } from '../types/trade';
import { useTheme } from '../contexts/ThemeContext';

export default function TradesList() {
  const { theme } = useTheme();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  useEffect(() => {
    filterTrades();
  }, [trades, searchTerm, selectedStatus]);

  async function fetchTrades() {
    try {
      const { data, error } = await supabase
        .from('Trades')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTrades(data);
        setFilteredTrades(data);
      }
    } catch (error) {
      console.error('Error fetching trades:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterTrades() {
    let filtered = [...trades];

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(trade => trade.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(trade => 
        trade.client_id.toLowerCase().includes(search) ||
        trade.device.toLowerCase().includes(search) ||
        trade.status.toLowerCase().includes(search) ||
        trade.lot.toString().includes(search) ||
        (trade.balance !== null && trade.balance.toString().includes(search))
      );
    }

    setFilteredTrades(filtered);
  }

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

  const getBalanceColor = (balance: number | null) => {
    if (balance === null) return '';
    if (theme === 'light') {
      return balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance < 0 ? 'text-red-500' : 'text-green-500';
  };

  const statuses = Array.from(new Set(trades.map(trade => trade.status))).filter(Boolean);

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Trades List
        </h1>
        
        {/* Filters */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${getCardClasses()} p-6 rounded-lg mb-6`}>
          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search in all fields..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-white border border-sky-200 text-sky-900 placeholder-sky-400'
                    : 'bg-gray-700 text-white placeholder-gray-400'
                } focus:outline-none focus:ring-2 focus:ring-sky-500`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme === 'light' ? 'text-sky-900' : 'text-gray-300'} mb-1`}>
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg ${
                theme === 'light'
                  ? 'bg-white border border-sky-200 text-sky-900'
                  : 'bg-gray-700 text-white'
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className={`${getCardClasses()} p-4 rounded-lg`}>
            <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Total Trades</div>
            <div className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
              {filteredTrades.length}
            </div>
          </div>
          <div className={`${getCardClasses()} p-4 rounded-lg`}>
            <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Total Volume</div>
            <div className={`text-2xl font-bold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
              {filteredTrades.reduce((sum, trade) => sum + trade.lot, 0).toFixed(2)}
            </div>
          </div>
          <div className={`${getCardClasses()} p-4 rounded-lg`}>
            <div className={theme === 'light' ? 'text-sky-900' : 'text-gray-400'}>Status Distribution</div>
            <div className="flex gap-2 mt-2">
              {statuses.map(status => (
                <span
                  key={status}
                  className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}
                >
                  {status}: {filteredTrades.filter(t => t.status === status).length}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Trades Table */}
        
        <div className={`${getCardClasses()} rounded-lg overflow-hidden`}>
          {loading ? (
            <div className="p-6 text-center">Loading...</div>
          ) : filteredTrades.length === 0 ? (
            <div className="p-6 text-center text-gray-400">No trades found</div>
          ) : (
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
                  {filteredTrades.map((trade) => (
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
                      <td className={`px-6 py-4 whitespace-nowrap font-medium ${getBalanceColor(trade.balance)}`}>
                        {trade.balance !== null ? trade.balance.toFixed(2) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}