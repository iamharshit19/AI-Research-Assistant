import { useState } from "react";
import { Upload, FileText, CheckCircle, Sparkles, MessageSquare, Send, Loader2 } from "lucide-react";
import { uploadDocument } from "../api";

export default function UploadSection({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [askLoading, setAskLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadResult(null);
      setAnswer(null);
      const res = await uploadDocument(formData);
      setUploadResult(res.data);
      if (onUpload) onUpload(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed: " + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setAskLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/uploads/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question,
          doc_id: uploadResult?.id
        }),
      });
      const data = await res.json();
      setAnswer(data);
    } catch (err) {
      console.error("Q&A error:", err);
      alert("Failed to get answer");
    } finally {
      setAskLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-indigo-400" />
          Upload a Research Paper
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="flex-1 w-full">
            <div className={`
              relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
              ${file
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
              }
            `}>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                  setUploadResult(null);
                  setAnswer(null);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <span className="text-gray-200 font-medium truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Click or drag a file here (PDF, TXT, DOC)
                  </p>
                </div>
              )}
            </div>
          </label>

          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`
              px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 min-w-[140px] justify-center
              ${loading || !file
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/30'
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload & Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Display */}
      {uploadResult && (
        <div className="bg-gray-900/60 border border-emerald-500/30 rounded-2xl p-6 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Document Processed</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">File:</span>
              <span className="text-gray-200 font-medium">{uploadResult.filename}</span>
              <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">
                {uploadResult.chunks} chunks indexed
              </span>
            </div>

            {uploadResult.summary && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <h4 className="text-sm font-semibold text-purple-300">AI Summary</h4>
                </div>
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {uploadResult.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Q&A Section - Only show after upload */}
      {uploadResult && (
        <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Ask Questions About Your Document
          </h3>

          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about the uploaded document..."
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && question.trim() && !askLoading) {
                  handleAsk();
                }
              }}
            />
            <button
              onClick={handleAsk}
              disabled={askLoading || !question.trim()}
              className={`
                px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2
                ${askLoading || !question.trim()
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                }
              `}
            >
              {askLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Ask
            </button>
          </div>

          {/* Answer Display */}
          {answer && (
            <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-5">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Answer
              </h4>
              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                {answer.answer}
              </p>

              {answer.sources && answer.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h5 className="text-xs text-gray-400 mb-2">Sources:</h5>
                  <div className="space-y-1">
                    {answer.sources.map((s, idx) => (
                      <div key={idx} className="text-xs text-gray-500 truncate">
                        • {s.filename || s.title || `Source ${idx + 1}`}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
