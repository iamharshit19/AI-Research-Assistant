import { useState } from "react";
import { Search, Calendar, Loader2, GraduationCap, BookOpen } from "lucide-react";

export default function ScholarSearchBox({ onResults, source = "scholar", onSourceChange }) {
    const [topic, setTopic] = useState("");
    const [yearLow, setYearLow] = useState("");
    const [yearHigh, setYearHigh] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!topic.trim()) return;

        setLoading(true);
        try {
            // Use different API endpoint based on source
            const endpoint = source === "arxiv"
                ? "http://localhost:8000/api/arxiv/search"
                : "http://localhost:8000/api/scholar/search";

            const body = source === "arxiv"
                ? {
                    topic: topic,
                    field: "cs.LG",
                    top_k: 5,
                    summarize: true
                }
                : {
                    topic: topic,
                    top_k: 5,
                    year_low: yearLow ? parseInt(yearLow) : null,
                    year_high: yearHigh ? parseInt(yearHigh) : null,
                    summarize: true
                };

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            onResults(data);
        } catch (error) {
            console.error("Search error:", error);
            alert(`${source === "arxiv" ? "ArXiv" : "Google Scholar"} search failed`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            {/* Source Toggle */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Search Papers
                </h2>

                <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                        onClick={() => onSourceChange?.("scholar")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${source === "scholar"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        <GraduationCap className="w-4 h-4" />
                        Scholar
                    </button>
                    <button
                        onClick={() => onSourceChange?.("arxiv")}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${source === "arxiv"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        ArXiv
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {/* Topic Input */}
                <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                        Research Topic
                    </label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g., machine learning, quantum computing..."
                        className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && topic.trim() && !loading) {
                                handleSearch();
                            }
                        }}
                    />
                </div>

                {/* Year Range Filters - Only show for Google Scholar */}
                {source === "scholar" && (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Year From
                            </label>
                            <input
                                type="number"
                                value={yearLow}
                                onChange={(e) => setYearLow(e.target.value)}
                                placeholder="2020"
                                min="1900"
                                max={new Date().getFullYear()}
                                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                Year To
                            </label>
                            <input
                                type="number"
                                value={yearHigh}
                                onChange={(e) => setYearHigh(e.target.value)}
                                placeholder="2024"
                                min="1900"
                                max={new Date().getFullYear()}
                                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>
                    </div>
                )}

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    disabled={loading || !topic.trim()}
                    className={`
            w-full px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2
            ${loading || !topic.trim()
                            ? 'bg-muted text-muted-foreground cursor-not-allowed'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }
          `}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Searching {source === "arxiv" ? "ArXiv" : "Google Scholar"}...
                        </>
                    ) : (
                        <>
                            <Search className="w-5 h-5" />
                            Search {source === "arxiv" ? "ArXiv" : "Google Scholar"}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
