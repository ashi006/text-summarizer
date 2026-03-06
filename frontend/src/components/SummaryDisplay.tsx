import ReactMarkdown from 'react-markdown';

interface SummaryDisplayProps {
    summary: string;
    isLoading: boolean;
    language?: string;
}

const RTL_LANGUAGES = ['ar', 'ur'];

const SummaryDisplay = ({ summary, isLoading, language }: SummaryDisplayProps) => {
    const isRTL = RTL_LANGUAGES.includes(language ?? '');

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-12 text-muted-foreground animate-pulse border-2 border-dashed rounded-lg">
                Summarizing... please wait.
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex h-full items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/10">
                <div className="text-center">
                    <div className="text-lg font-medium">No Summary Generated</div>
                    <p className="text-sm mt-1">Process your input to see results here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative h-full flex flex-col min-h-0">
            <div
                className="flex-1 overflow-y-auto border rounded-lg bg-background p-4 prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed"
                dir={isRTL ? 'rtl' : 'ltr'}
                style={isRTL ? { textAlign: 'right', lineHeight: '2', fontFamily: 'serif' } : undefined}
            >
                <ReactMarkdown>
                    {summary}
                </ReactMarkdown>
            </div>
        </div>
    );
};

export default SummaryDisplay;
