import { useState } from "react";
import { Search, Sparkles, GraduationCap, BookOpen } from "lucide-react";
import ScholarSearchBox from "../components/ScholarSearchBox";
import ScholarResults from "../components/ScholarResults";

export default function ScholarResearch() {
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState("");
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [source, setSource] = useState("arxiv"); // Default to ArXiv since Scholar is blocked

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4 py-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
                    {source === "arxiv" ? (
                        <>
                            <BookOpen className="w-4 h-4" />
                            <span>Powered by ArXiv</span>
                        </>
                    ) : (
                        <>
                            <GraduationCap className="w-4 h-4" />
                            <span>Powered by Google Scholar</span>
                        </>
                    )}
                </div>
                {source=="arxiv" ? (
                     <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Arxiv Research
                </h1>) : (
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Scholar Research
                </h1>)
}
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Search academic papers, get AI-powered summaries, and synthesize insights directly from the source.
                </p>
            </div>

            <ScholarSearchBox
                onResults={setResults}
                source={source}
                onSourceChange={setSource}
            />

            <ScholarResults results={results} />

            {results && results.papers && results.papers.length > 0 && (
                <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        Ask a Question About These Papers
                    </h2>

                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything about the summarized papers..."
                            className="flex-1 px-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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
                            className={`px-6 py-2 rounded-md font-medium transition-colors ${loading || !query.trim()
                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                                }`}
                        >
                            {loading ? "Thinking..." : "Ask"}
                        </button>
                    </div>

                    {answer && (
                        <div className="mt-6 bg-muted/30 p-5 rounded-lg border border-border">
                            <h3 className="font-semibold text-foreground mb-2">Answer</h3>
                            <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">{answer.answer}</p>

                            {answer.sources && answer.sources.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Sources:</h4>
                                    <ul className="list-disc list-inside text-sm text-muted-foreground">
                                        {answer.sources.map((s, idx) => (
                                            <li key={idx}>{s}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
