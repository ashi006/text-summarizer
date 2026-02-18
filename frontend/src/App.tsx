import { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import SummaryDisplay from './components/SummaryDisplay';
import api from './services/api';

function App() {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Hydrate from sessionStorage on load
  useEffect(() => {
    const savedSummary = sessionStorage.getItem('last_summary');
    if (savedSummary) {
      setSummary(savedSummary);
    }
    const savedText = sessionStorage.getItem('last_input_text');
    if (savedText) {
      setInputText(savedText);
    }
  }, []);

  // Save to sessionStorage when summary or input changes
  useEffect(() => {
    sessionStorage.setItem('last_summary', summary);
    sessionStorage.setItem('last_input_text', inputText);
  }, [summary, inputText]);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');
    try {
      const result = await api.summarize(inputText);
      setSummary(result.summary);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to summarize text. Please check your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setSummary('');
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

        <SummaryDisplay summary={summary} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
