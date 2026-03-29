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
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Research Paper
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="flex-1 w-full">
            <div className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${file
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
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
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="font-medium truncate max-w-xs">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
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
              px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 min-w-[140px] justify-center
              ${loading || !file
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:bg-primary/90'
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
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Summary Display */}
      {uploadResult && (
        <div className="bg-card border border-border rounded-lg p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">Document Processed</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">File:</span>
              <span className="font-medium">{uploadResult.filename}</span>
              <span className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs border border-border">
                {uploadResult.chunks} chunks
              </span>
            </div>

            {uploadResult.summary && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-sm font-semibold">Summary</h4>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto pr-2">
                    {uploadResult.summary}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Q&A Section */}
      {uploadResult && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ask Questions
          </h3>

          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything about the document..."
              className="flex-1 px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
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
                px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                ${askLoading || !question.trim()
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
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
            <div className="mt-6 bg-muted/30 border border-border rounded-lg p-6">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Answer
              </h4>
              <p className="whitespace-pre-wrap leading-relaxed mb-4 max-h-64 overflow-y-auto pr-2">
                {answer.answer}
              </p>

              {answer.sources && answer.sources.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <h5 className="text-xs font-semibold text-muted-foreground mb-2">Sources:</h5>
                  <div className="space-y-1">
                    {answer.sources.map((s, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground truncate">
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
