import { useEffect, useState } from "react";
import { Sparkles, Moon, Stars } from "lucide-react";
import { CapitalizeFirstLetter } from "./Utils";
import { DrawnCard } from "./types/DrawnCard";
import { Spread, SPREADS, SpreadType } from "./types/Spreads";
import {ImagePreloader, ImageURLs} from "./ImagePreloader";

interface DrawResponse {
  cards: DrawnCard[];
  spread: SpreadType;
}

enum Loading {
  Idle,
  Drawing,
  Interpreting,
}

function App() {
  const [question, setQuestion] = useState("");
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [cards, setCards] = useState<DrawnCard[] | null>(null);
  const [spread, setSpread] = useState<Spread>(SPREADS["three_card"]);
  const [loading, setLoading] = useState<Loading>(Loading.Idle);
  const [error, setError] = useState<string[]>([]);
  const [renderedCards, setRenderedCards] = useState<JSX.Element[]>([]);

  const renderCards = async () => {
    if (!cards) return
    let rc = cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-lg p-4 text-center border border-white/30"
                  >
                    <div className="text-xs text-purple-200 mb-1">
                      {spread?.positions[idx]?.name || `Position ${idx + 1}`}
                    </div>
                    <div>
                      <img
                        src={card.image_url ?? ""}
                        alt={card.name}
                        className="mx-auto mb-2 rounded-md shadow-md"
                        style={
                          card.orientation == "reversed"
                            ? { transform: "rotate(180deg)" }
                            : {}
                        }
                      />
                    </div>
                    <div className="font-semibold">{card.name}</div>
                    <span className="text-xs bg-purple-500/30 px-3 py-1 rounded-full border border-purple-400/50">
                      {CapitalizeFirstLetter(card.orientation)}
                    </span>
                  </div>
                ))
    setRenderedCards(rc)
  }
  
  useEffect(() => {
    
    const getInterpretation = async () => {
      let data = "";
      const abortController = new AbortController();
      const signal = abortController.signal;

      setLoading(Loading.Interpreting);
      setInterpretation(null);

      try {
        const response = await fetch("/api/interpret", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question.trim(),
            spread: spread.type,
            cards: cards,
            depth: "standard",
          }),
          signal,
        });

        if (!response.ok) {
          throw new Error("Failed to get interpretation");
        }

        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunkText = decoder.decode(value, { stream: true });
          data += chunkText;
          // Update React state with the new accumulated data
          setInterpretation(data);
        }
      } catch (err) {
        error.push("Unable to get interpretation. Please try again.");
        setError([...error]);
      } finally {
        setLoading(Loading.Idle);
      }
    };

    if (cards) {
      (async () => {
        await renderCards();
        await getInterpretation();
      })();
    }
  }, [cards]);

  const drawCards = async () => {
    setLoading(Loading.Drawing);
    setError([]);

    try {
      const response = await fetch("/api/draw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spread: spread.type }),
      });

      if (!response.ok) {
        throw new Error("Failed to draw cards");
      }

      const data: DrawResponse = await response.json();
      setCards(data.cards);
      setSpread(SPREADS[data.spread]);
    } catch (err) {
      error.push("Unable to draw cards. Please try again.");
      setError([...error]);
      setLoading(Loading.Idle);
    }
  };

  const getReading = async () => {
    await drawCards();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      getReading();
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
          <p className="text-purple-200 text-lg">
            Ask your question and receive guidance from the cards
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-purple-200">
              What guidance do you seek?
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your question here..."
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-white placeholder-purple-300/50 min-h-32"
              disabled={loading !== Loading.Idle}
            />
            <p className="text-xs text-purple-300/70 mt-1">
              Press Ctrl+Enter to submit
            </p>
          </div>

          <button
            onClick={getReading}
            disabled={loading !== Loading.Idle}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 rounded-lg font-semibold text-lg shadow-lg transition-all transform hover:scale-105 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {loading === Loading.Idle && (
              <>
                <Sparkles className="w-5 h-5" />
                Draw Cards
              </>
            )}
            {loading === Loading.Drawing && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Consulting the cards...
              </>
            )}
            {loading === Loading.Interpreting && (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Interpreting your reading...
              </>
            )}
          </button>

          {error.length > 0 && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {error.map((err, idx) => (
                <div key={idx}>{err}</div>
              ))}
            </div>
          )}
        </div>

        {cards && (
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                Your Reading
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {renderedCards}
            </div>
            {interpretation && (
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                {/* <span className="text-xs bg-purple-500/30 px-3 py-1 rounded-full border border-purple-400/50">
                    Extended Reading
                  </span> */}
                <h3 className="font-semibold text-purple-200 mb-3">
                  Interpretation:
                </h3>
                <p className="text-white/90 leading-relaxed whitespace-pre-wrap">
                  {interpretation.trimEnd()}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {/* <ImagePreloader imageUrls={ImageURLs} /> */}
    </div>
  );
}

export default App;
