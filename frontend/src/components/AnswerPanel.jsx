export default function AnswerPanel({ answer }) {
  if (!answer) return null;

  return (
    <div className="backdrop-blur-xl bg-white/70 shadow-xl border border-gray-200/50 rounded-2xl p-6 mt-10 w-full max-w-3xl mx-auto animate-fadeIn">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        🧠 <span>Assistant’s Answer</span>
      </h3>

      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
        {answer.text}
      </p>

      {answer.sources && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-800 mb-2">Sources</h4>
          <ul className="list-disc ml-6 text-sm text-blue-700 space-y-1">
            {answer.sources.map((s, i) => (
              <li key={i} className="hover:underline cursor-pointer">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
