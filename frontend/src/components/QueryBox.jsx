import { useState } from "react";
import { askRAG } from "../api";




export default function QueryBox({ onAnswer }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
const res = await askRAG(query);

      onAnswer(res.data);
    } catch {
      alert("Query failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-2xl mx-auto text-center mt-8">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask your research question..."
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring"
        rows={3}
      />
      <button
        onClick={handleAsk}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 mt-3 rounded-lg"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}
