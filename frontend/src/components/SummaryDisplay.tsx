import React from 'react';

interface SummaryDisplayProps {
    summary: string;
    isLoading: boolean;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, isLoading }) => {
    const copyToClipboard = () => {
        navigator.clipboard.writeText(summary);
        alert('Summary copied to clipboard!');
    };

    if (isLoading) {
        return (
            <div className="summary-display" style={{ marginTop: '20px', padding: '20px', border: '1px dashed #007bff', borderRadius: '8px' }}>
                <p>Summarizing... please wait.</p>
            </div>
        );
    }

    if (!summary) return null;

    return (
        <div className="summary-display" style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f0f7ff', border: '1px solid #007bff', borderRadius: '8px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>Summary</h3>
                <button
                    onClick={copyToClipboard}
                    style={{ padding: '4px 12px', cursor: 'pointer', borderRadius: '4px', background: '#007bff', color: 'white', border: 'none' }}
                >
                    Copy
                </button>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                {summary}
            </div>
        </div>
    );
};

export default SummaryDisplay;
