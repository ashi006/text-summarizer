import React from 'react';

interface SummaryTypeTabsProps {
    summaryType: string;
    onSummaryTypeChange: (type: string) => void;
    isLoading: boolean;
}

const SummaryTypeTabs: React.FC<SummaryTypeTabsProps> = ({ summaryType, onSummaryTypeChange, isLoading }) => {
    const tabs = [
        { id: 'brief', label: 'Brief' },
        { id: 'detailed', label: 'Detailed' },
        { id: 'key_points', label: 'Key Points' },
        { id: 'action_points', label: 'Action Points' },
    ];

    return (
        <div className="summary-type-tabs" style={{
            display: 'flex',
            borderBottom: '1px solid #dee2e6',
            marginBottom: '20px'
        }}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onSummaryTypeChange(tab.id)}
                    disabled={isLoading}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderBottom: summaryType === tab.id ? '2px solid #007bff' : '2px solid transparent',
                        backgroundColor: 'transparent',
                        color: summaryType === tab.id ? '#007bff' : '#495057',
                        fontWeight: summaryType === tab.id ? 'bold' : 'normal',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontSize: '15px'
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
};

export default SummaryTypeTabs;
