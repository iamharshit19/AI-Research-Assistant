import { useState } from "react";
import { Upload } from "lucide-react";
import UploadSection from "../components/UploadSection";

export default function UploadPaper() {
    const [uploadedDoc, setUploadedDoc] = useState(null);

    return (
        <div className="space-y-8 max-w-4xl mx-auto py-8">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-sm font-medium text-secondary-foreground">
                    <Upload className="w-4 h-4" />
                    <span>Document Analysis</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    Upload Research Paper
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Upload your research documents to extract insights, generate summaries, and ask questions.
                </p>
            </div>

            <UploadSection onUpload={(data) => {
                setUploadedDoc(data);
            }} />

            {uploadedDoc && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center justify-center">
                    <p className="text-green-700 dark:text-green-400 text-sm font-medium">
                        ✓ Document uploaded: {uploadedDoc.filename || 'File processed successfully'}
                    </p>
                </div>
            )}
        </div>
    );
}
