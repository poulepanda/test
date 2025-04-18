import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';

interface VoteCount {
  vote: string;
  count: number;
}

const questions = [
  "Do you believe artificial intelligence will benefit humanity?",
  "Should remote work become the standard for office jobs?",
  "Is social media having a positive impact on society?",
  "Should cryptocurrency be more regulated?",
  "Do you support a four-day work week?"
];

export default function BBChat() {
  const { theme } = useTheme();
  const [menVoteData, setMenVoteData] = useState<VoteCount[]>([]);
  const [womenVoteData, setWomenVoteData] = useState<VoteCount[]>([]);
  const [totalVoteData, setTotalVoteData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedGender, setSelectedGender] = useState<'men' | 'women'>('men');
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);

  const getCardClasses = () => {
    return theme === 'light'
      ? 'bg-sky-50 shadow-lg'
      : 'bg-gray-800';
  };

  useEffect(() => {
    fetchVoteResults();
  }, [currentQuestionIndex]);

  async function fetchVoteResults() {
    try {
      // Fetch all votes for the current question
      const { data: allData, error: allError } = await supabase
        .from('votes')
        .select('vote')
        .eq('question_id', currentQuestionIndex.toString());

      if (allError) throw allError;

      // Fetch men's votes
      const { data: menData, error: menError } = await supabase
        .from('votes')
        .select('vote')
        .eq('gender', 'men')
        .eq('question_id', currentQuestionIndex.toString());

      if (menError) throw menError;

      // Fetch women's votes
      const { data: womenData, error: womenError } = await supabase
        .from('votes')
        .select('vote')
        .eq('gender', 'women')
        .eq('question_id', currentQuestionIndex.toString());

      if (womenError) throw womenError;

      // Process total votes
      const totalCounts = allData.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.vote] = (acc[curr.vote] || 0) + 1;
        return acc;
      }, {});

      const total = Object.values(totalCounts).reduce((a, b) => a + b, 0);
      setTotalVoteData([
        { name: 'Yes', value: ((totalCounts['yes'] || 0) / total) * 100 },
        { name: 'No', value: ((totalCounts['no'] || 0) / total) * 100 }
      ]);

      // Process men's votes
      const menCounts = menData.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.vote] = (acc[curr.vote] || 0) + 1;
        return acc;
      }, {});

      // Process women's votes
      const womenCounts = womenData.reduce((acc: { [key: string]: number }, curr) => {
        acc[curr.vote] = (acc[curr.vote] || 0) + 1;
        return acc;
      }, {});

      setMenVoteData([
        { vote: 'Yes', count: menCounts['yes'] || 0 },
        { vote: 'No', count: menCounts['no'] || 0 }
      ]);

      setWomenVoteData([
        { vote: 'Yes', count: womenCounts['yes'] || 0 },
        { vote: 'No', count: womenCounts['no'] || 0 }
      ]);
    } catch (err) {
      console.error('Error fetching votes:', err);
      setError('Failed to load voting results');
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(value: 'yes' | 'no') {
    try {
      const { error } = await supabase
        .from('votes')
        .insert([{
          vote: value,
          gender: selectedGender,
          question_id: currentQuestionIndex.toString()
        }]);

      if (error) throw error;

      setVote(value);
      await fetchVoteResults();
    } catch (err) {
      console.error('Error submitting vote:', err);
      setError('Failed to submit vote');
    }
  }

  const COLORS = theme === 'light' 
    ? ['#0284c7', '#be185d'] // sky-600, pink-700
    : ['#38bdf8', '#ec4899']; // sky-400, pink-500

  const getPercentage = (value: number, data: VoteCount[]) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setVote(null);
  };

  const prevQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + questions.length) % questions.length);
    setVote(null);
  };

  return (
    <div className="p-6">
      <h1 className={`text-2xl font-bold mb-6 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
        Community Voting
      </h1>


      {/* Question Carousel */}
      <div className={`${getCardClasses()} rounded-lg p-6 mb-6`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={prevQuestion}
            className={`p-2 rounded-full ${theme === 'light' ? 'hover:bg-sky-100' : 'hover:bg-gray-700'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className={`text-xl font-semibold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
            {questions[currentQuestionIndex]}
          </h2>
          <button
            onClick={nextQuestion}
            className={`p-2 rounded-full ${theme === 'light' ? 'hover:bg-sky-100' : 'hover:bg-gray-700'}`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        

        {/* Gender Selection and Voting */}
        {!vote && (
          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setSelectedGender('men')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedGender === 'men'
                    ? theme === 'light' ? 'bg-sky-500 text-white' : 'bg-blue-500 text-white'
                    : theme === 'light' ? 'bg-sky-100 text-sky-900' : 'bg-gray-700 text-white'
                }`}
              >
                Men
              </button>
              <button
                onClick={() => setSelectedGender('women')}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedGender === 'women'
                    ? theme === 'light' ? 'bg-pink-500 text-white' : 'bg-pink-500 text-white'
                    : theme === 'light' ? 'bg-pink-100 text-pink-900' : 'bg-gray-700 text-white'
                }`}
              >
                Women
              </button>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleVote('yes')}
                className={`px-6 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-green-600 text-white hover:bg-green-500'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => handleVote('no')}
                className={`px-6 py-2 rounded-lg ${
                  theme === 'light'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-red-600 text-white hover:bg-red-500'
                }`}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>

      
      {/* Overall Results */}
      <div className={`${getCardClasses()} rounded-lg p-6 mb-6`}>
        <h2 className={`text-xl font-semibold mb-4 ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
          Overall Results
        </h2>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={totalVoteData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Percentage']}
                contentStyle={{
                  backgroundColor: theme === 'light' ? '#ffffff' : '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: theme === 'light' ? '#1f2937' : '#fff'
                }}
              />
              <Bar dataKey="value" fill={theme === 'light' ? '#0284c7' : '#38bdf8'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results */}
      <div className={`${getCardClasses()} rounded-lg p-6`}>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Men's Chart */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
                Men's Votes
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={menVoteData}
                      dataKey="count"
                      nameKey="vote"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ vote, count }) => `${vote}: ${count} (${getPercentage(count, menVoteData)}%)`}
                    >
                      {menVoteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value} votes (${getPercentage(value, menVoteData)}%)`,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Women's Chart */}
            <div className="space-y-4">
              <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-sky-900' : 'text-white'}`}>
                Women's Votes
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={womenVoteData}
                      dataKey="count"
                      nameKey="vote"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      label={({ vote, count }) => `${vote}: ${count} (${getPercentage(count, womenVoteData)}%)`}
                    >
                      {womenVoteData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `${value} votes (${getPercentage(value, womenVoteData)}%)`,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}