import React from 'react';

interface PersonalizationPanelProps {
    style: string;
    onStyleChange: (style: string) => void;
    tonality: string;
    onTonalityChange: (tonality: string) => void;
    isLoading: boolean;
}

const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({
    style,
    onStyleChange,
    tonality,
    onTonalityChange,
    isLoading
}) => {

    const styles = [
        { value: 'paragraph', label: 'Paragraph' },
        { value: 'bullets', label: 'Bullet Points' },
        { value: 'numbered', label: 'Numbered List' },
    ];

    const tonalities = [
        { value: 'professional', label: 'Professional' },
        { value: 'casual', label: 'Casual' },
        { value: 'simplified', label: 'Simplified' },
    ];

    return (
        <div className="personalization-panel" style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            textAlign: 'left'
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '16px', color: '#495057' }}>Customize Summary</h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                {/* Style Selection */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Format Style</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {styles.map((option) => (
                            <label key={option.value} style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                                <input
                                    type="radio"
                                    name="style"
                                    value={option.value}
                                    checked={style === option.value}
                                    onChange={(e) => onStyleChange(e.target.value)}
                                    disabled={isLoading}
                                    style={{ marginRight: '5px' }}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Tonality Selection */}
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Tonality</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {tonalities.map((option) => (
                            <label key={option.value} style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                                <input
                                    type="radio"
                                    name="tonality"
                                    value={option.value}
                                    checked={tonality === option.value}
                                    onChange={(e) => onTonalityChange(e.target.value)}
                                    disabled={isLoading}
                                    style={{ marginRight: '5px' }}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalizationPanel;
