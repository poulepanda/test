import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { supabase } from '../lib/supabase';
import type { Trade } from '../types/trade';
import TradingViewWidget from '../components/TradingViewWidget';
import { useTheme } from '../contexts/ThemeContext';

// Sample trade cards data
const tradeCards = [
  { title: "Bitcoin Trading", description: "24/7 cryptocurrency trading with advanced order types", image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=500" },
  { title: "Forex Exchange", description: "Global currency pair trading with competitive spreads", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500" },
  { title: "Stock Market", description: "Access to major global stock exchanges", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500" },
  { title: "Commodities", description: "Trade gold, silver, oil and other commodities", image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?w=500" },
  { title: "Options Trading", description: "Advanced options trading strategies", image: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=500" }
];

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
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [stopLoss, setStopLoss] = useState<number>(50);
  const [takeProfit, setTakeProfit] = useState<number>(12.5);

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  useEffect(() => {
    fetchTrades();
  }, [selectedDevice, clientId, lot]);

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCardIndex((prevIndex) => 
        prevIndex >= tradeCards.length - 3 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update carousel position when currentCardIndex changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(-${currentCardIndex * (100 / 3)}%)`;
    }
  }, [currentCardIndex]);

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

  const saveTrade = async (type: 'buy' | 'sell') => {
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
            status: type,
            lot: lot,
            balance: balance
          }
        ]);

      if (error) throw error;
      
      setStatus('success');
      await fetchTrades();
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Error saving trade:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    } finally {
      setSaveLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'buy':
        return theme === 'light' 
          ? 'bg-indigo-100 text-indigo-800' 
          : 'bg-indigo-500 bg-opacity-10 text-indigo-400';
      case 'sell':
        return theme === 'light' 
          ? 'bg-amber-100 text-amber-800' 
          : 'bg-amber-500 bg-opacity-10 text-amber-400';
      default:
        return theme === 'light' 
          ? 'bg-gray-100 text-gray-800' 
          : 'bg-gray-500 bg-opacity-10 text-gray-400';
    }
  };

  const getBalanceColor = (balance: number | null) => {
    if (balance === null) return '';
    if (theme === 'light') {
      return balance < 0 ? 'text-red-600' : 'text-green-600';
    }
    return balance < 0 ? 'text-red-500' : 'text-green-500';
  };

  const chartData = trades.map(trade => ({
    time: new Date(trade.created_at).toLocaleTimeString(),
    lot: trade.lot,
    status: trade.status,
    balance: trade.balance
  }));

  return (
    <div className="p-6 max-w-full overflow-x-hidden">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Trading Analysis
        </h1>

        {/* Trading Cards Carousel */}
        <div className={`${getCardClasses()} p-6 rounded-lg mb-6`}>
          <h2 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            Trading Services
          </h2>
          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ width: `${(tradeCards.length * 100) / 3}%` }}
            >
              {tradeCards.map((card, index) => (
                <div
                  key={index}
                  className="px-2"
                  style={{ width: `${100 / tradeCards.length}%` }}
                >
                  <div className={`${getCardClasses()} rounded-lg overflow-hidden h-full`}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className={`text-lg font-semibold mb-2 ${
                        theme === 'light' ? 'text-sky-900' : 'text-white'
                      }`}>
                        {card.title}
                      </h3>
                      <p className={theme === 'light' ? 'text-sky-700' : 'text-gray-300'}>
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Interface */}
        <div className={`${getCardClasses()} p-6 rounded-lg mb-6`}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Stop Loss */}
            <div className="bg-black bg-opacity-80 rounded-lg p-4">
              <div className="flex items-center justify-between text-white mb-2">
                <span>STOP LOSS</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setStopLoss(prev => Math.max(0, prev - 5))}
                    className="bg-green-900 hover:bg-green-800 px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-green-500 min-w-[60px] text-center">${stopLoss}</span>
                  <button 
                    onClick={() => setStopLoss(prev => prev + 5)}
                    className="bg-green-900 hover:bg-green-800 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Take Profit */}
            <div className="bg-black bg-opacity-80 rounded-lg p-4">
              <div className="flex items-center justify-between text-white mb-2">
                <span>TAKE PROFIT</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setTakeProfit(prev => Math.max(0, prev - 2.5))}
                    className="bg-green-900 hover:bg-green-800 px-3 py-1 rounded"
                  >
                    -
                  </button>
                  <span className="text-green-500 min-w-[60px] text-center">${takeProfit}</span>
                  <button 
                    onClick={() => setTakeProfit(prev => prev + 2.5)}
                    className="bg-green-900 hover:bg-green-800 px-3 py-1 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Price Display */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-black bg-opacity-80 rounded-lg p-4">
              <div className="text-green-500 text-2xl font-bold mb-1">0.97241</div>
              <div className="text-white">$62.5</div>
              <div className="mt-2 text-green-500">+25%</div>
              <button 
                onClick={() => saveTrade('buy')}
                disabled={true}
                className="w-full mt-4 bg-green-600 opacity-50 cursor-not-allowed text-white py-3 rounded-lg font-bold"
              >
                BUY
              </button>
            </div>

            <div className="bg-black bg-opacity-80 rounded-lg p-4">
              <div className="text-red-500 text-2xl font-bold mb-1">0.93691</div>
              <div className="text-white">$62.5</div>
              <div className="mt-2 text-red-500">-25%</div>
              <button 
                onClick={() => saveTrade('sell')}
                disabled={true}
                className="w-full mt-4 bg-red-600 opacity-50 cursor-not-allowed text-white py-3 rounded-lg font-bold"
              >
                SELL
              </button>
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
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${getBalanceColor(trade.balance)}`}>
                      {trade.balance !== null ? trade.balance.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}