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
        <div className="relative h-full flex flex-col">
            <div
                className="flex-1 whitespace-pre-wrap leading-relaxed text-sm p-4 overflow-y-auto border rounded-lg bg-background"
                dir={isRTL ? 'rtl' : 'ltr'}
                style={isRTL ? { textAlign: 'right', lineHeight: '2', fontFamily: 'serif' } : undefined}
            >
                {summary}
            </div>
        </div>
    );
};

export default SummaryDisplay;
