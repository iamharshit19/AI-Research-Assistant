import { useState } from "react";
import { Search, Calendar, Loader2 } from "lucide-react";

export default function ScholarSearchBox({ onResults }) {
    const [topic, setTopic] = useState("");
    const [yearLow, setYearLow] = useState("");
    const [yearHigh, setYearHigh] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/api/scholar/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    topic: topic,
                    top_k: 5,
                    year_low: yearLow ? parseInt(yearLow) : null,
                    year_high: yearHigh ? parseInt(yearHigh) : null,
                    summarize: true
                }),
            });
            const data = await response.json();
            onResults(data);
        } catch (error) {
            console.error("Scholar search error:", error);
            alert("Google Scholar search failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-400" />
                Search Google Scholar Papers
            </h2>

            <div className="space-y-4">
                {/* Topic Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Research Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., machine learning, quantum computing..."
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && topic.trim() && !loading) {
                                handleSearch();
                            }
                        }}
                    />
                </div>

                {/* Year Range Filters */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Year From (Optional)
                        </label>
                        <input
                            type="number"
                            value={yearLow}
                            onChange={(e) => setYearLow(e.target.value)}
                            placeholder="e.g., 2020"
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Year To (Optional)
                        </label>
                        <input
                            type="number"
                            value={yearHigh}
                            onChange={(e) => setYearHigh(e.target.value)}
                            placeholder="e.g., 2026"
                            min="1900"
                            max={new Date().getFullYear()}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={loading || !topic.trim()}
                    className={`
            w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2
            ${loading || !topic.trim()
                            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/30'
                        }
          `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Searching Google Scholar...
                        </>
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            Search Google Scholar
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
