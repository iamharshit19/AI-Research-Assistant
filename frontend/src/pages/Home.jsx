import { ArrowRight, BookOpen, Brain, Search, Sparkles, Upload } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Research Assistant</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Autonomous Research <br className="hidden md:inline" />
          <span className="text-muted-foreground">Made Simple</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
          Upload documents or search Google Scholar. Extract insights, identify gaps, and get answers in seconds.
        </p>
      </section>

      {/* Main Actions */}
      <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          to="/upload"
          className="group block p-8 rounded-lg border border-border bg-card hover:border-primary transition-colors hover:shadow-sm"
        >
          <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Upload Paper
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-muted-foreground">
            Analyze PDF, TXT, or DOC files. Get summaries and insights instantly.
          </p>
        </Link>

        <Link
          to="/scholar"
          className="group block p-8 rounded-lg border border-border bg-card hover:border-primary transition-colors hover:shadow-sm"
        >
          <div className="mb-4 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-foreground">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
            Google Scholar
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-muted-foreground">
            Search academic papers, view citations, and explore topics.
          </p>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto border-t border-border pt-16">
        <div className="p-4">
          <BookOpen className="w-8 h-8 mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Smart Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Automatically extracts key insights and patterns from your documents.
          </p>
        </div>
        <div className="p-4">
          <Brain className="w-8 h-8 mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Gap Detection</h3>
          <p className="text-sm text-muted-foreground">
            Identifies missing links and research opportunities in the literature.
          </p>
        </div>
        <div className="p-4">
          <Sparkles className="w-8 h-8 mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">Instant Answers</h3>
          <p className="text-sm text-muted-foreground">
            Ask complex questions and get precise, cited answers from context.
          </p>
        </div>
      </section>
    </div>
  );
}