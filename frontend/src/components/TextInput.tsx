import React from 'react';

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, onClear }) => {
    return (
        <div className="text-input-container">
            <textarea
                placeholder="Paste your medical transcript here..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={10}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>
                    Character count: {value.length}
                </span>
                <button
                    onClick={onClear}
                    style={{ padding: '4px 12px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ddd', background: '#f8f8f8' }}
                >
                    Clear
                </button>
            </div>
        </div>
    );
};

export default TextInput;
