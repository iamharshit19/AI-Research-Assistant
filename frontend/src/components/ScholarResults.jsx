import { FileText, ExternalLink, User, Calendar, Quote } from "lucide-react";

export default function ScholarResults({ results }) {
    if (!results) return null;

    const { papers, aggregate_summary } = results;

    return (
        <div className="space-y-6 mt-8">
            {/* Aggregate Summary */}
            {aggregate_summary && (
                <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Quote className="w-5 h-5 text-indigo-400" />
                        Literature Overview
                    </h3>
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {aggregate_summary}
                    </div>
                </div>
            )}

            {/* Individual Papers */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Top Papers ({papers?.length || 0})
                </h3>

                {papers && papers.length > 0 ? (
                    papers.map((paper, idx) => (
                        <div
                            key={idx}
                            className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 shadow-lg"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="text-lg font-semibold text-white flex-1">
                                    {paper.title}
                                </h4>
                                {paper.citations > 0 && (
                                    <span className="ml-4 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium flex items-center gap-1 shrink-0">
                                        <Quote className="w-4 h-4" />
                                        {paper.citations} citations
                                    </span>
                                )}
                            </div>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                                {paper.authors && (
                                    <div className="flex items-center gap-1">
                                        <User className="w-4 h-4" />
                                        <span>{paper.authors}</span>
                                    </div>
                                )}
                                {paper.year && (
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{paper.year}</span>
                                    </div>
                                )}
                            </div>

                            {/* Abstract */}
                            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                                {paper.abstract}
                            </p>

                            {/* Summary */}
                            {paper.summary && (
                                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-4">
                                    <h5 className="text-sm font-semibold text-purple-300 mb-2">
                                        AI Summary
                                    </h5>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                        {paper.summary}
                                    </p>
                                </div>
                            )}

                            {/* Links */}
                            <div className="flex gap-3">
                                {paper.pdf_url && (
                                    <a
                                        href={paper.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
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
                                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Publisher
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-8 text-center">
                        <p className="text-gray-400">No papers found for this search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
