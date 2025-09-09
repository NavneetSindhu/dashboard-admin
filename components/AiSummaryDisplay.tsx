import React, { useState, useCallback } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { DocumentDuplicateIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface AiSummaryDisplayProps {
    summary: string;
}

// A lightweight Markdown to HTML parser
const parseMarkdown = (text: string): string => {
    return text
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2">$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
        .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
        .replace(/\n/g, '<br />'); // Handle new lines
};

const AiSummaryDisplay: React.FC<AiSummaryDisplayProps> = ({ summary }) => {
    const { t } = useTranslation();
    const [copyButtonText, setCopyButtonText] = useState(t('copy_text'));

    const handleCopyToClipboard = useCallback(() => {
        // Create a temporary element to parse HTML and get plain text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = parseMarkdown(summary).replace(/<br \/>/g, '\n'); // Convert breaks to newlines for plain text
        
        navigator.clipboard.writeText(tempDiv.textContent || '').then(() => {
            setCopyButtonText(t('copied'));
            setTimeout(() => setCopyButtonText(t('copy_text')), 2000);
        });
    }, [summary, t]);

    const handleExportToPdf = useCallback(() => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>AI Generated Summary</title>
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            body { font-family: sans-serif; padding: 2rem; }
                            h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem; }
                            h3 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
                            ul { list-style-position: inside; }
                            li { margin-bottom: 0.25rem; }
                            strong { font-weight: 600; }
                        </style>
                    </head>
                    <body>
                        <h1>AI Generated Summary</h1>
                        <hr style="margin: 1rem 0;" />
                        <div>${parseMarkdown(summary)}</div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => { // Timeout to allow content to render
                printWindow.print();
                printWindow.close();
            }, 500);
        }
    }, [summary]);

    return (
        <div className="ai-summary-container">
            <div 
                className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300 leading-relaxed dark:[&>h2]:text-white dark:[&>h3]:text-gray-200"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(summary) }}
            />
            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={handleCopyToClipboard}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                    {copyButtonText}
                </button>
                <button
                    onClick={handleExportToPdf}
                    className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    {t('export_pdf')}
                </button>
            </div>
        </div>
    );
};

export default AiSummaryDisplay;