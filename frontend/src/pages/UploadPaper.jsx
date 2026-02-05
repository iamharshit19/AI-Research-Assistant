import { useState } from "react";
import { Brain, Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import UploadSection from "../components/UploadSection";

export default function UploadPaper() {
    const [uploadedDoc, setUploadedDoc] = useState(null);

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
                                <p className="text-xs text-gray-400">Upload Research Paper</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to="/"
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Home
                            </Link>
                            <Link
                                to="/dashboard"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white transition-all duration-300 text-sm font-medium"
                            >
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="relative z-10 flex flex-col items-center py-16 px-4">
                <div className="text-center mb-12 max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full mb-6">
                        <Upload className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm text-indigo-300 font-medium">Document Analysis</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent leading-tight">
                        Upload Research Paper
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Upload your research documents and let AI extract insights, generate summaries,
                        and answer your questions in seconds.
                    </p>
                </div>

                <div className="w-full max-w-4xl">
                    <UploadSection onUpload={(data) => {
                        setUploadedDoc(data);
                    }} />

                    {uploadedDoc && (
                        <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                            <p className="text-emerald-300 text-sm">
                                ✓ Document uploaded: {uploadedDoc.filename || 'File processed successfully'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
