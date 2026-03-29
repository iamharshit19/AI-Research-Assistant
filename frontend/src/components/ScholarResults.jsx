import { FileText, ExternalLink, User, Calendar, Quote } from "lucide-react";

export default function ScholarResults({ results }) {
    if (!results) return null;

    const { papers, aggregate_summary } = results;

    return (
        <div className="space-y-6 mt-8">
            {/* Aggregate Summary */}
            {aggregate_summary && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Quote className="w-5 h-5" />
                        Literature Overview
                    </h3>
                    <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto pr-2">
                        {aggregate_summary}
                    </div>
                </div>
            )}

            {/* Individual Papers */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Top Papers ({papers?.length || 0})
                </h3>

                {papers && papers.length > 0 ? (
                    papers.map((paper, idx) => (
                        <div
                            key={idx}
                            className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-medium flex-1 text-foreground">
                                    {paper.title}
                                </h4>
                                {paper.citations > 0 && (
                                    <span className="ml-4 px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded text-sm font-medium flex items-center gap-1 shrink-0 border border-border">
                                        <Quote className="w-3 h-3" />
                                        {paper.citations}
                                    </span>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                                {paper.authors && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        <span>{paper.authors}</span>
                                    </div>
                                )}
                                {paper.year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{paper.year}</span>
                                    </div>
                                )}
                            </div>

                            {/* Abstract */}
                            <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-3">
                                {paper.abstract}
                            </p>

                            {/* Summary */}
                            {paper.summary && (
                                <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
                                    <h5 className="text-sm font-medium mb-1 flex items-center gap-2">
                                        AI Summary
                                    </h5>
                                    <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto pr-2">
                                        {paper.summary}
                                    </p>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex gap-3 pt-2">
                                {paper.pdf_url && (
                                    <a
                                        href={paper.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Paper
                                    </a>
                                )}
                                {paper.pub_url && paper.pub_url !== paper.pdf_url && (
                                    <a
                                        href={paper.pub_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Publisher Link
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-card border border-border rounded-lg p-8 text-center">
                        <p className="text-muted-foreground">No papers found for this search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
