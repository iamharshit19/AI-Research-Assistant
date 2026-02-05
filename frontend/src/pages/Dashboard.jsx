import { useEffect, useState, useRef } from "react";
import {
  RefreshCw,
  Upload,
  FileText,
  TrendingUp,
  AlertCircle,
  ChevronRight,

  Search,
  Brain,
  BarChart3,
  Download,
  X
} from "lucide-react";

import { fetchHistory, fetchSummaries, fetchGaps } from "../api";


function Card({ title, children, className, icon: Icon }) {
  return (
    <div
      className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl p-6 hover:border-gray-700 transition-all duration-300 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        {Icon && <Icon className="w-5 h-5 text-indigo-400" />}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}


function DocList({ docs, onRefresh }) {
  return (
    <div className="space-y-4">

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          Uploaded Documents
        </h3>

        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-300 text-gray-300"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>


      {docs.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">
          No documents yet.
        </div>
      ) : (
        <div className="space-y-3">
          {docs.map((d) => (
            <div
              key={d.id}
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-indigo-500/50 hover:bg-gray-800 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start">

                <div className="flex-1">
                  <div className="font-medium text-gray-100 group-hover:text-white transition-colors">
                    {d.title || d.filename || "Untitled Document"}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {d.source || "upload"}
                  </div>
                  {d.uploadedAt && (
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(d.uploadedAt).toLocaleString()}
                    </div>
                  )}
                </div>


                <div className="text-right flex flex-col items-end gap-2">
                  <div className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md">
                    {d.chunks ? `${d.chunks} chunks` : "-"}
                  </div>

                  <a
                    href={`/viewer/${d.id}`}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                  >
                    Open <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function SummaryList({ summaries }) {
  return (
    <div className="space-y-4">
      {summaries.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-8">
          No summaries yet.
        </div>
      ) : (
        summaries.map((s) => (
          <div
            key={s.id}
            className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 hover:bg-gray-800 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-gray-100">
                  {s.title || "Summary"}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {s.date ? new Date(s.date).toLocaleDateString() : "—"}
                </div>
              </div>

              {s.score && (
                <div className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded-md">
                  {(s.score * 100).toFixed(0)}% confidence
                </div>
              )}
            </div>

            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {s.text}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

function GapHeatmap({ gaps }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        No detected gaps yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {gaps.map((g, idx) => {
        const intensity = Math.min(1, Math.max(0, g.intensity ?? 0.25));

        const getGradient = (intensity) => {
          if (intensity > 0.7) return "from-red-900/80 to-red-800/80";
          if (intensity > 0.5) return "from-orange-900/80 to-orange-800/80";
          return "from-yellow-900/80 to-yellow-800/80";
        };

        return (
          <div
            key={idx}
            className={`bg-gradient-to-br ${getGradient(
              intensity
            )} border border-gray-700 rounded-xl p-4 hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer`}
          >
            <div className="font-semibold text-white text-sm mb-2">
              {g.topic}
            </div>

            <div className="text-xs text-gray-300 mb-3 line-clamp-2">
              {g.description?.slice(0, 80)}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-200 font-medium">
                Gap: {(intensity * 100).toFixed(0)}%
              </span>

              <button
                onClick={() => alert(g.description)}
                className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Dropdown component for nav buttons
function Dropdown({ isOpen, onClose, children, className = "" }) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full right-0 mt-2 bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50 ${className}`}
    >
      {children}
    </div>
  );
}

// Search Modal Component
function SearchModal({ isOpen, onClose, docs, summaries, gaps }) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const allItems = [
    ...docs.map(d => ({ type: 'document', title: d.title || 'Untitled', ...d })),
    ...summaries.map(s => ({ type: 'summary', title: s.title || 'Summary', ...s })),
    ...gaps.map(g => ({ type: 'gap', title: g.topic, ...g })),
  ];

  const filteredItems = searchQuery.trim()
    ? allItems.filter(item =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-24">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents, summaries, gaps..."
            className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none text-lg"
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {searchQuery.trim() === "" ? (
            <div className="text-gray-500 text-center py-8">
              Start typing to search...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              No results found for "{searchQuery}"
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 hover:bg-gray-800/50 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${item.type === 'document' ? 'bg-indigo-500/20 text-indigo-300' :
                    item.type === 'summary' ? 'bg-purple-500/20 text-purple-300' :
                      'bg-pink-500/20 text-pink-300'
                    }`}>
                    {item.type}
                  </span>
                  <span className="text-white font-medium">{item.title}</span>
                </div>
                {item.text && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.text}</p>
                )}
                {item.description && (
                  <p className="text-gray-500 text-sm mt-1 line-clamp-1">{item.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


export default function Dashboard() {
  const [docs, setDocs] = useState([]);
  const [summaries, setSummaries] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [arxivResults, setArxivResults] = useState(null);

  // UI State for interactive components
  const [showSearch, setShowSearch] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const h = await fetchHistory();
      const s = await fetchSummaries();
      const g = await fetchGaps();

      setDocs(h.data);
      setSummaries(s.data);
      setGaps(g.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Export dashboard data as JSON
  const handleExport = () => {
    const exportData = {
      exportedAt: new Date().toISOString(),
      documents: docs,
      summaries: summaries,
      gaps: gaps,
      stats: {
        totalDocuments: docs.length,
        totalSummaries: summaries.length,
        totalGaps: gaps.length,
        avgConfidence: summaries.length > 0
          ? Math.round((summaries.reduce((acc, s) => acc + (s.score || 0), 0) / summaries.length) * 100)
          : 0
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-dashboard-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        docs={docs}
        summaries={summaries}
        gaps={gaps}
      />


      <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ResearchAI</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>


            <div className="flex items-center gap-4">
              <a
                href="/"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium"
              >
                ← Home
              </a>

              {/* Search Button */}
              <button
                onClick={() => setShowSearch(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-300 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>



            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-8">


          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Research Dashboard
              </h1>
              <p className="text-gray-400 mt-2">
                Your research uploads, summaries, and detected gaps
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchAll}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl transition-all duration-300 text-gray-300"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 border-indigo-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{docs.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Documents</p>
                </div>
                <FileText className="w-10 h-10 text-indigo-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {summaries.length}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Summaries</p>
                </div>
                <BarChart3 className="w-10 h-10 text-purple-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border-pink-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{gaps.length}</p>
                  <p className="text-sm text-gray-400 mt-1">Research Gaps</p>
                </div>
                <AlertCircle className="w-10 h-10 text-pink-400 opacity-50" />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">
                    {summaries.length > 0
                      ? Math.round(
                        (summaries.reduce(
                          (acc, s) => acc + (s.score || 0),
                          0
                        ) /
                          summaries.length) *
                        100
                      )
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-gray-400 mt-1">Avg Confidence</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-400 opacity-50" />
              </div>
            </Card>
          </div>


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="lg:col-span-2 space-y-8">
              <Card title="Top Summaries" icon={BarChart3}>
                <SummaryList summaries={summaries.slice(0, 3)} />
              </Card>

              <Card title="Research Gaps Heatmap" icon={AlertCircle}>
                <GapHeatmap gaps={gaps.slice(0, 9)} />
              </Card>
            </div>


            <div className="space-y-8">
              <Card title="Quick Actions" icon={TrendingUp}>
                <div className="space-y-3">
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </button>

                  <button
                    onClick={handleExport}
                    className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </Card>

              <Card title="Uploaded Documents" icon={FileText}>
                <DocList docs={docs.slice(0, 6)} onRefresh={fetchAll} />
              </Card>
            </div>
          </div>


          <Card title="All Research Gaps (Detailed)" icon={AlertCircle}>
            <div className="space-y-4">
              {gaps.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  No detected gaps.
                </div>
              ) : (
                gaps.map((g, i) => (
                  <div
                    key={i}
                    className="p-5 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-gray-600 hover:bg-gray-800 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-100 text-lg">
                          {g.topic}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {g.description.slice(0, 120)}...
                        </div>
                      </div>

                      <div
                        className={`text-sm font-bold px-3 py-1 rounded-lg ${g.intensity > 0.7
                          ? "bg-red-500/20 text-red-300"
                          : g.intensity > 0.5
                            ? "bg-orange-500/20 text-orange-300"
                            : "bg-yellow-500/20 text-yellow-300"
                          }`}
                      >
                        {(g.intensity * 100).toFixed(0)}%
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {g.description}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
