import { Brain, Upload, BookOpen, Sparkles, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-indigo-950 relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>


      <nav className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">ResearchAI</h1>
                <p className="text-xs text-gray-400">Autonomous Assistant</p>
              </div>
            </div>

            <Link
              to="/dashboard"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </nav>


      <div className="relative z-10 flex flex-col items-center py-16 px-4">

        <div className="text-center mb-12 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300 font-medium">Powered by Advanced NLP</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
            Autonomous Research
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload your research documents or search Google Scholar. Let AI extract insights, identify gaps,
            and answer complex questions in seconds.
          </p>

          <div className="gap-6 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">20s</div>
              <div className="text-sm text-gray-500">Avg Response Time</div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8 max-w-4xl w-full">
          <Link
            to="/upload"
            className="group bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/30">
              <Upload className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Upload Research Paper
              <ArrowRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Upload PDF, TXT, or DOC files and get AI-powered summaries, insights, and instant answers to your questions.
            </p>
          </Link>

          <Link
            to="/scholar"
            className="group bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/30">
              <Search className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
              Google Scholar Research
              <ArrowRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Search academic papers from Google Scholar, get comprehensive summaries, and explore research topics with AI assistance.
            </p>
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl w-full">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Analysis</h3>
            <p className="text-sm text-gray-400">
              AI-powered document understanding that extracts key insights and patterns automatically.
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gap Detection</h3>
            <p className="text-sm text-gray-400">
              Automatically identify research gaps and opportunities for new discoveries.
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-pink-500/50 transition-all duration-300">
            <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Instant Answers</h3>
            <p className="text-sm text-gray-400">
              Get precise answers to complex questions from your research corpus instantly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}