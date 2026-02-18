import React from 'react';

interface LanguageSelectorProps {
    selectedLanguage: string;
    onLanguageChange: (lang: string) => void;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'fi', name: 'Finnish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ur', name: 'Urdu' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onLanguageChange }) => {
    return (
        <div className="language-selector" style={{ marginBottom: '20px' }}>
            <label htmlFor="language-select" style={{ marginRight: '10px', fontWeight: 'bold' }}>
                Translating into:
            </label>
            <select
                id="language-select"
                value={selectedLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
                <option value="">Original Language</option>
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LanguageSelector;
