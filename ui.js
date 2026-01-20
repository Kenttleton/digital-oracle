import { useState } from 'react';
import { Sparkles, Moon, Stars } from 'lucide-react';

export default function TarotReader() {
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cards = [
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
    'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
    'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
    'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun',
    'Judgement', 'The World'
  ];

  const getReading = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    setReading(null);

    try {
      const response = await fetch('http://localhost:8000/api/reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to get reading');
      }

      const data = await response.json();
      setReading(data);
    } catch (err) {
      setError('Unable to connect to the server. Make sure the Python backend is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-8 h-8" />
            <h1 className="text-5xl font-bold">Mystic Tarot</h1>
            <Stars className="w-8 h-8" />
          </div>
          <p className="text-purple-200 text-lg">Ask your question and receive guidance from the cards</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-purple-200">
              What guidance do you seek?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question here..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/50 min-h-32"
              disabled={loading}
            />
          </div>

          <button
            onClick={getReading}
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Consulting the cards...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Draw Cards
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </div>

        {reading && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-300" />
              Your Reading
            </h2>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              {reading.cards.map((card, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg p-4 text-center border border-white/30">
                  <div className="text-xs text-purple-200 mb-1">
                    {['Past', 'Present', 'Future'][idx]}
                  </div>
                  <div className="font-semibold">{card}</div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="font-semibold text-purple-200 mb-3">Interpretation:</h3>
              <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{reading.interpretation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}