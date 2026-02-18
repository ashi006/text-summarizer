import { useState, useEffect } from 'react';
import TextInput from './components/TextInput';
import SummaryDisplay from './components/SummaryDisplay';
import LanguageSelector from './components/LanguageSelector';
import FileUpload from './components/FileUpload';
import PersonalizationPanel from './components/PersonalizationPanel';
import SummaryTypeTabs from './components/SummaryTypeTabs';
import api from './services/api';
import logo from './assets/logo.svg';

function App() {
  const [inputText, setInputText] = useState('');
  const [originalSummary, setOriginalSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [style, setStyle] = useState('paragraph');
  const [tonality, setTonality] = useState('professional');
  const [summaryType, setSummaryType] = useState('brief');
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

  // Trigger summary generation when summaryType changes (if there is text)
  useEffect(() => {
    if (inputText && !isLoading) {
      handleSummarize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summaryType]);

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');
    setSelectedLanguage('');
    try {
      const result = await api.summarize(inputText, {
        style,
        tonality,
        summary_type: summaryType
      });
      setOriginalSummary(result.summary);
      setDisplayedSummary(result.summary);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to summarize text.');
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

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await api.uploadFile(file);
      setInputText(result.text);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload file.');
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

  const handleSummaryTypeChange = (type: string) => {
    setSummaryType(type);
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <img src={logo} alt="GOSTA Labs" style={{ height: '80px', marginBottom: '0' }} />
          <div className="logo-title" style={{ margin: 0 }}>GOSTA Labs</div>
        </div>

        <button className="new-encounter-btn">
          + New summary
        </button>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px', color: '#6c757d', fontWeight: 'bold' }}>
            Context
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderTop: '1px solid #dee2e6' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#dee2e6' }}></div>
            <span style={{ fontSize: '14px' }}>Medical User</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="header">
          <h2 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>Transcript Summarizer</h2>
        </header>

        {/* Scrollable Content */}
        <div className="content-scroll">
          <div className="two-column-grid">


            {/* Left Column: Input */}
            <div className="left-column">
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Input Transcript</h3>
              <FileUpload onUpload={handleFileUpload} isLoading={isLoading} />
              <div style={{ marginBottom: '20px' }}></div>
              <TextInput
                value={inputText}
                onChange={setInputText}
                onClear={handleClear}
              />
            </div>

            {/* Right Column: Configuration & Output */}
            <div className="right-column">
              <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Configuration & Output</h3>

              <SummaryTypeTabs
                summaryType={summaryType}
                onSummaryTypeChange={handleSummaryTypeChange}
                isLoading={isLoading}
              />

              <div style={{ marginBottom: '20px' }}>
                <PersonalizationPanel
                  style={style}
                  onStyleChange={setStyle}
                  tonality={tonality}
                  onTonalityChange={setTonality}
                  isLoading={isLoading}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button
                  onClick={handleSummarize}
                  disabled={isLoading || !inputText.trim()}
                  style={{
                    backgroundColor: '#000',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    fontWeight: '600',
                    opacity: (isLoading || !inputText.trim()) ? 0.5 : 1
                  }}
                >
                  {isLoading ? 'Processing...' : 'Generate Summary'}
                </button>
              </div>

              {error && (
                <div style={{ padding: '15px', backgroundColor: '#fff5f5', border: '1px solid #fc8181', borderRadius: '4px', color: '#c53030', marginBottom: '20px' }}>
                  {error}
                </div>
              )}

              {originalSummary && (
                <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '20px' }}>
                  <h4 style={{ fontSize: '18px', marginBottom: '15px' }}>Result</h4>
                  <LanguageSelector
                    selectedLanguage={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                  />
                  <SummaryDisplay
                    summary={displayedSummary}
                    isLoading={isLoading}
                    onRegenerate={handleSummarize}
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
