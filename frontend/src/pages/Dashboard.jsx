import { useEffect, useState, useRef } from "react";
import {
  RefreshCw,
  Upload,
  FileText,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Search,
  BarChart3,
  Download,
  X,
  MoreHorizontal
} from "lucide-react";

import { fetchHistory, fetchSummaries, fetchGaps } from "../api";

function Card({ title, children, className, icon: Icon, action }) {
  return (
    <div
      className={`bg-card border border-border rounded-lg p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function DocList({ docs, onRefresh }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          Uploaded Documents
        </h3>
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 text-sm px-3 py-2 bg-background hover:bg-muted border border-border rounded-md transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8">
          No documents yet.
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-lg bg-card">
          {docs.map((d) => (
            <div
              key={d.id}
              className="p-4 hover:bg-muted/50 transition-colors group flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground truncate">
                  {d.title || d.filename || "Untitled Document"}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>{d.source || "upload"}</span>
                  <span>•</span>
                  {d.uploadedAt && <span>{new Date(d.uploadedAt).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                  {d.chunks ? `${d.chunks} chunks` : "-"}
                </span>
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
        <div className="text-sm text-muted-foreground text-center py-8">
          No summaries yet.
        </div>
      ) : (
        <div className="divide-y divide-border border border-border rounded-lg bg-card">
          {summaries.map((s) => (
            <div
              key={s.id}
              className="p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-foreground text-sm">
                  {s.title || "Summary"}
                </h4>
                {s.score && (
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                    {(s.score * 100).toFixed(0)}%
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GapHeatmap({ gaps }) {
  if (!gaps || gaps.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No detected gaps yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {gaps.map((g, idx) => {
        const intensity = Math.min(1, Math.max(0, g.intensity ?? 0.25));
        return (
          <div
            key={idx}
            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1 min-w-0 mr-4">
              <div className="font-medium text-sm text-foreground truncate">{g.topic}</div>
              <div className="text-xs text-muted-foreground truncate">{g.description}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${intensity * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium w-8 text-right">
                {(intensity * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        );
      })}
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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-24">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-2xl mx-4 overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-lg"
          />
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {searchQuery.trim() === "" ? (
            <div className="text-muted-foreground text-center py-8">
              Start typing to search...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-muted-foreground text-center py-8">
              No results found.
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={idx}
                className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-1.5 py-0.5 rounded border border-border bg-secondary text-secondary-foreground uppercase font-semibold tracking-wider">
                    {item.type}
                  </span>
                  <span className="text-foreground font-medium text-sm">{item.title}</span>
                </div>
                {item.text && (
                  <p className="text-muted-foreground text-xs line-clamp-1">{item.text}</p>
                )}
                {item.description && (
                  <p className="text-muted-foreground text-xs line-clamp-1">{item.description}</p>
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
    <div className="space-y-8">
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        docs={docs}
        summaries={summaries}
        gaps={gaps}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your research activities and insights.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={() => setShowSearch(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={fetchAll}
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-background border border-border hover:bg-muted text-foreground rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExport}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-colors text-sm font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">Documents</div>
          <div className="text-2xl font-bold text-foreground">{docs.length}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">Summaries</div>
          <div className="text-2xl font-bold text-foreground">{summaries.length}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">Gaps</div>
          <div className="text-2xl font-bold text-foreground">{gaps.length}</div>
        </div>
        <div className="bg-card border border-border p-4 rounded-lg">
          <div className="text-sm font-medium text-muted-foreground mb-1">Avg Confidence</div>
          <div className="text-2xl font-bold text-foreground">
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card title="Recent Summaries" icon={BarChart3}>
            <SummaryList summaries={summaries.slice(0, 5)} />
          </Card>

          <Card title="Detected Gaps" icon={AlertCircle}>
            <GapHeatmap gaps={gaps.slice(0, 5)} />
          </Card>
        </div>

        <div className="space-y-8">
          <div className="bg-secondary/50 rounded-lg p-6 border border-border">
            <h3 className="font-semibold mb-2">Pro Tip</h3>
            <p className="text-sm text-muted-foreground">
              Upload more documents to improve the accuracy of gap detection and automated summaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
