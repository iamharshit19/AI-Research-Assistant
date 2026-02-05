import { useState } from "react";
import { searchArxiv } from "../api";

export default function ArxivSearchBox({ onResults }) {
  const [topic, setTopic] = useState("");
  const [field, setField] = useState("cs.LG");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await searchArxiv(topic, field, 5);
      onResults(res.data);
    } catch {
      alert("ArXiv search failed");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">
        Search ArXiv Research Papers
      </h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter research topic (e.g. graph neural networks)"
        className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg"
      />

      <select
        value={field}
        onChange={(e) => setField(e.target.value)}
        className="w-full p-3 mb-4 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg"
      >
        <option value="cs.LG">Machine Learning (cs.LG)</option>
        <option value="cs.AI">Artificial Intelligence (cs.AI)</option>
        <option value="stat.ML">Statistics ML (stat.ML)</option>
      </select>

      <button
        onClick={handleSearch}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg"
      >
        {loading ? "Searching..." : "Search ArXiv"}
      </button>
    </div>
  );
}
