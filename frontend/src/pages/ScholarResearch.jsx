import { useState } from "react";
import { Search, Brain, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import ScholarSearchBox from "../components/ScholarSearchBox";
import ScholarResults from "../components/ScholarResults";

export default function ScholarResearch() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 relative overflow-hidden">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">ResearchAI</h1>
                                <p className="text-xs text-gray-400">Google Scholar Research</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-all duration-300 text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 flex flex-col items-center py-16 px-4">
                <div className="text-center mb-12 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-indigo-300 font-medium">Powered by Google Scholar</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                        Google Scholar
                        <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Research Assistant
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Search academic papers from Google Scholar, get AI-powered summaries,
                        and ask questions about research topics.
                    </p>
                </div>

                <div className="w-full max-w-4xl">
                    <ScholarSearchBox onResults={setResults} />

                    <ScholarResults results={results} />

                    {results && results.papers && results.papers.length > 0 && (
                        <div className="mt-10 bg-gray-900/60 border border-gray-800 p-6 rounded-2xl shadow-xl">
                            <h2 className="text-2xl text-white font-bold mb-4 flex items-center gap-2">
                                <Search className="w-5 h-5 text-indigo-400" />
                                Ask a Question About These Papers
                            </h2>

                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Ask anything about the summarized papers..."
                                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && query.trim()) {
                                            e.preventDefault();
                                            document.getElementById('ask-btn')?.click();
                                        }
                                    }}
                                />

                                <button
                                    id="ask-btn"
                                    onClick={async () => {
                                        if (!query.trim()) return;
                                        setLoading(true);
                                        try {
                                            const res = await fetch("http://localhost:8000/api/rag/ask", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    question: query,
                                                    papers: results.papers,
                                                    aggregate_summary: results.aggregate_summary
                                                }),
                                            });

                                            const data = await res.json();
                                            setAnswer(data);
                                        } catch (err) {
                                            console.error("Error asking question:", err);
                                            alert("Failed to get answer. Please try again.");
                                        }
                                        setLoading(false);
                                    }}
                                    disabled={loading || !query.trim()}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${loading || !query.trim()
                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/30'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Thinking...
                                        </span>
                                    ) : "Ask"}
                                </button>
                            </div>

                            {answer && (
                                <div className="mt-6 bg-gray-800/70 border border-gray-700 p-5 rounded-xl">
                                    <h3 className="text-lg font-semibold text-white mb-2">Answer</h3>
                                    <p className="text-gray-300 whitespace-pre-wrap">{answer.answer}</p>

                                    {answer.sources && answer.sources.length > 0 && (
                                        <>
                                            <h4 className="text-sm text-gray-400 mt-4">Sources:</h4>
                                            <ul className="list-disc text-gray-400 ml-6 mt-1">
                                                {answer.sources.map((s, idx) => (
                                                    <li key={idx}>{s}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
