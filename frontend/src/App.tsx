import { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import SummaryDisplay from './components/SummaryDisplay';
import LanguageSelector from './components/LanguageSelector';
import api from './services/api';

function App() {
  const [inputText, setInputText] = useState('');
  const [originalSummary, setOriginalSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hydrate from sessionStorage on load
  useEffect(() => {
    const savedSummary = sessionStorage.getItem('last_summary');
    if (savedSummary) {
      setOriginalSummary(savedSummary);
      setDisplayedSummary(savedSummary);
    }
    const savedText = sessionStorage.getItem('last_input_text');
    if (savedText) {
      setInputText(savedText);
    }
  }, []);

  // Save to sessionStorage when summary or input changes
  useEffect(() => {
    sessionStorage.setItem('last_summary', originalSummary);
    sessionStorage.setItem('last_input_text', inputText);
  }, [originalSummary, inputText]);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');
    setSelectedLanguage(''); // Reset language when re-summarizing
    try {
      const result = await api.summarize(inputText);
      setOriginalSummary(result.summary);
      setDisplayedSummary(result.summary);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to summarize text. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    if (!lang) {
      setDisplayedSummary(originalSummary);
      return;
    }

    if (!originalSummary) return;

    setIsLoading(true);
    setError('');
    try {
      const result = await api.translate(originalSummary, lang);
      setDisplayedSummary(result.translated_text);
    } catch (err: any) {
      console.error(err);
      setError('Failed to translate summary.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOriginalSummary('');
    setDisplayedSummary('');
    setSelectedLanguage('');
    sessionStorage.removeItem('last_summary');
    sessionStorage.removeItem('last_input_text');
  };

  return (
    <div className="App" style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ color: '#0056b3' }}>Medical Transcript Summarizer</h1>
        <p style={{ color: '#666' }}>Transform complex patient transcripts into clear summaries.</p>
      </header>

      <main>
        <TextInput
          value={inputText}
          onChange={setInputText}
          onClear={handleClear}
        />

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleSummarize}
            disabled={isLoading || !inputText.trim()}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: (isLoading || !inputText.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !inputText.trim()) ? 0.7 : 1
            }}
          >
            {isLoading ? 'Processing...' : 'Summarize'}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff5f5', border: '1px solid #fc8181', borderRadius: '8px', color: '#c53030' }}>
            {error}
          </div>
        )}

        {originalSummary && (
          <div style={{ marginTop: '30px' }}>
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
            />
            <SummaryDisplay summary={displayedSummary} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
