export default function ArxivResults({ results }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="mt-10 space-y-6">
      {results.map((p, i) => (
        <div
          key={i}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white">{p.title}</h3>
          <p className="text-sm text-gray-400 mt-2">{p.abstract}</p>

          <div className="mt-4 text-indigo-300 text-sm">
            <a href={p.pdf_url} target="_blank" rel="noopener">
              📄 PDF Link
            </a>
          </div>

          {p.summary && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-white font-semibold">LLaMA Summary</h4>
              <p className="text-gray-300 mt-2 whitespace-pre-wrap">
                {p.summary}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
