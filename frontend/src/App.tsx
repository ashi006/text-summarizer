import { useState, useEffect, useRef } from 'react';
import TextInput from './components/TextInput';
import SummaryDisplay from './components/SummaryDisplay';
import LanguageSelector from './components/LanguageSelector';
import PersonalizationPanel from './components/PersonalizationPanel';
import SummaryTypeTabs from './components/SummaryTypeTabs';
import HistoryList from './components/HistoryList';
import api from './services/api';
import historyApi from './services/historyApi';
import type { HistoryItem } from './services/historyApi';
import { useDeviceId } from './hooks/useDeviceId';
import { Loader2, Copy, Paperclip, RotateCcw, Eraser, Menu, X } from "lucide-react";
import logo from './assets/logo.svg';
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";

function App() {
  const deviceId = useDeviceId();
  const [inputText, setInputText] = useState('');
  const [originalSummary, setOriginalSummary] = useState('');
  const [displayedSummary, setDisplayedSummary] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [style, setStyle] = useState('paragraph');
  const [tonality, setTonality] = useState('professional');
  const [summaryType, setSummaryType] = useState('brief');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [historySkip, setHistorySkip] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hydrate from localStorage on load
  useEffect(() => {
    const savedSummary = localStorage.getItem('last_summary');
    const savedDisplayed = localStorage.getItem('last_displayed_summary');
    const savedLang = localStorage.getItem('last_language');
    const savedText = localStorage.getItem('last_input_text');
    const savedStyle = localStorage.getItem('last_style');
    const savedTonality = localStorage.getItem('last_tonality');
    const savedSummaryType = localStorage.getItem('last_summary_type');

    if (savedSummary) setOriginalSummary(savedSummary);
    if (savedDisplayed) setDisplayedSummary(savedDisplayed);
    else if (savedSummary) setDisplayedSummary(savedSummary);
    if (savedLang) setSelectedLanguage(savedLang);
    if (savedText) setInputText(savedText);
    if (savedStyle) setStyle(savedStyle);
    if (savedTonality) setTonality(savedTonality);
    if (savedSummaryType) setSummaryType(savedSummaryType);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('last_summary', originalSummary);
    localStorage.setItem('last_input_text', inputText);
    localStorage.setItem('last_style', style);
    localStorage.setItem('last_tonality', tonality);
    localStorage.setItem('last_summary_type', summaryType);
  }, [originalSummary, inputText, style, tonality, summaryType]);

  // Fetch history when deviceId is available
  useEffect(() => {
    if (!deviceId) return;
    historyApi.getHistory(deviceId, 0)
      .then(({ items, has_more }) => {
        setHistory(items);
        setHasMore(has_more);
        setHistorySkip(items.length);
      })
      .catch(() => { });
  }, [deviceId]);

  // Reset and reload first page of history
  const fetchHistory = async () => {
    if (!deviceId) return;
    try {
      const { items, has_more } = await historyApi.getHistory(deviceId, 0);
      setHistory(items);
      setHasMore(has_more);
      setHistorySkip(items.length);
    } catch { }
  };

  // Append next page (called by infinite scroll)
  const loadMoreHistory = async () => {
    if (!deviceId || !hasMore) return;
    try {
      const { items, has_more } = await historyApi.getHistory(deviceId, historySkip);
      setHistory((prev) => [...prev, ...items]);
      setHasMore(has_more);
      setHistorySkip((prev) => prev + items.length);
    } catch { }
  };

  const handleNewSummary = async () => {
    // Save current summary to DB whenever there is one in the UI (upsert — no duplicates)
    if (originalSummary && deviceId) {
      try {
        await historyApi.saveHistory(deviceId, {
          input_text: inputText,
          summary: originalSummary,
          translated_summary: displayedSummary !== originalSummary ? displayedSummary : null,
          summary_type: summaryType,
          style,
          tonality,
          language: selectedLanguage || 'original',
        });
        await fetchHistory();
      } catch { }
    }
    // Clear UI for a fresh summary
    setInputText('');
    setOriginalSummary('');
    setDisplayedSummary('');
    setSelectedLanguage('');
    setCurrentHistoryId(null);
    localStorage.removeItem('last_summary');
    localStorage.removeItem('last_displayed_summary');
    localStorage.removeItem('last_language');
    localStorage.removeItem('last_input_text');
  };

  const handleSelectHistory = (item: HistoryItem) => {
    // If there's a summary currently in the UI, save it before switching
    if (originalSummary && deviceId) {
      historyApi.saveHistory(deviceId, {
        input_text: inputText,
        summary: originalSummary,
        translated_summary: displayedSummary !== originalSummary ? displayedSummary : null,
        summary_type: summaryType,
        style,
        tonality,
        language: selectedLanguage || 'original',
      }).then(fetchHistory).catch(() => { });
    }
    // Load the clicked history item into the UI
    setInputText(item.input_text);
    setOriginalSummary(item.summary);
    setDisplayedSummary(item.translated_summary ?? item.summary);
    setSelectedLanguage(item.language === 'original' ? '' : item.language);
    setSummaryType(item.summary_type);
    setStyle(item.style);
    setTonality(item.tonality);
    setCurrentHistoryId(item.id);
  };

  const handleDeleteHistory = async (id: string) => {
    if (!deviceId) return;
    try {
      await historyApi.deleteSummary(deviceId, id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
      // If the deleted item is currently shown in the UI, clear the UI
      if (currentHistoryId === id) {
        setCurrentHistoryId(null);
        setInputText('');
        setOriginalSummary('');
        setDisplayedSummary('');
        setSelectedLanguage('');
        localStorage.removeItem('last_summary');
        localStorage.removeItem('last_displayed_summary');
        localStorage.removeItem('last_language');
        localStorage.removeItem('last_input_text');
      }
      await fetchHistory(); // Sync from server to catch any race-condition re-inserts
    } catch { }
  };


  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter text or upload a file.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSelectedLanguage(''); // Clear language selection on new summary
    setOriginalSummary(''); // Clear previous summary before generating new one
    setDisplayedSummary('');
    setCurrentHistoryId(null);

    try {
      const result = await api.summarize(inputText, {
        style,
        tonality,
        summary_type: summaryType
      });
      setOriginalSummary(result.summary);
      setDisplayedSummary(result.summary);
      // Summary stays in localStorage only — DB save happens on "New summary" click
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to summarize text.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!inputText.trim() && !originalSummary.trim()) return; // Nothing to regenerate from

    setIsRegenerating(true);
    setError(null);
    // Preserve the currently selected language so we can re-translate after regeneration
    const currentLanguage = selectedLanguage;

    try {
      // Regenerate from the original input text if available, otherwise from the last original summary
      const textToSummarize = inputText.trim() ? inputText : originalSummary;
      const result = await api.summarize(textToSummarize, {
        style,
        tonality,
        summary_type: summaryType
      });
      setOriginalSummary(result.summary);

      // Re-translate the new summary into the previously selected language if one was active
      if (currentLanguage && currentLanguage !== 'original') {
        try {
          const translated = await api.translate(result.summary, currentLanguage);
          setDisplayedSummary(translated.translated_text);
          localStorage.setItem('last_displayed_summary', translated.translated_text);
        } catch {
          // If translation fails, fall back to English
          setDisplayedSummary(result.summary);
          localStorage.setItem('last_displayed_summary', result.summary);
          setSelectedLanguage('');
        }
      } else {
        setDisplayedSummary(result.summary);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to regenerate summary.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    setSelectedLanguage(lang);
    if (!lang || lang === 'original') {
      setDisplayedSummary(originalSummary);
      localStorage.setItem('last_displayed_summary', originalSummary);
      localStorage.setItem('last_language', '');
      // Update DB record to clear translation
      if (deviceId && originalSummary) {
        historyApi.saveHistory(deviceId, {
          input_text: inputText,
          summary: originalSummary,
          translated_summary: null,
          summary_type: summaryType,
          style,
          tonality,
          language: 'original',
        }).then(fetchHistory).catch(() => { });
      }
      return;
    }

    if (!originalSummary) return;

    setIsGenerating(true);
    setError(null);
    try {
      const result = await api.translate(originalSummary, lang);
      setDisplayedSummary(result.translated_text);
      localStorage.setItem('last_displayed_summary', result.translated_text);
      localStorage.setItem('last_language', lang);
      // Persist language + translated summary to DB immediately
      if (deviceId) {
        historyApi.saveHistory(deviceId, {
          input_text: inputText,
          summary: originalSummary,
          translated_summary: result.translated_text,
          summary_type: summaryType,
          style,
          tonality,
          language: lang,
        }).then(fetchHistory).catch(() => { });
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to translate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await api.uploadFile(file);
      setInputText(result.text);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to upload file.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOriginalSummary('');
    setDisplayedSummary('');
    setSelectedLanguage('');
    localStorage.removeItem('last_summary');
    localStorage.removeItem('last_displayed_summary');
    localStorage.removeItem('last_language');
    localStorage.removeItem('last_input_text');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSummaryTypeChange = (type: string) => {
    setSummaryType(type);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-[200px] border-r bg-muted/95 backdrop-blur-sm flex flex-col p-3 z-50 transition-transform duration-300 md:relative md:translate-x-0 md:bg-muted/30 md:w-[180px]
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 cursor-default'}
      `}>
        <div className="flex items-center justify-between mb-6 md:justify-center">
          <div className="flex flex-col items-center">
            <img src={logo} alt="GOSTA Labs" className="h-[50px] mx-auto mb-0" />
            <div className="text-sm font-bold text-center">GOSTA Labs</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Button className="w-full gap-2 shrink-0" size="sm" onClick={() => { handleNewSummary(); setIsSidebarOpen(false); }}>
          <span>+</span> New summary
        </Button>

        <div className="flex-1 overflow-y-auto">
          <HistoryList
            items={history}
            onSelect={(item) => { handleSelectHistory(item); setIsSidebarOpen(false); }}
            onDelete={handleDeleteHistory}
            activeId={currentHistoryId}
            hasMore={hasMore}
            onLoadMore={loadMoreHistory}
          />
        </div>

        <div className="mt-auto pt-3 border-t shrink-0">
          <div className="text-xs font-semibold text-muted-foreground mb-1.5">Context</div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted-foreground/20 shrink-0" />
            <span className="text-xs truncate">Medical User</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto md:overflow-hidden bg-[var(--bg)]">
        {/* Top Header */}
        <header className="h-[50px] border-b flex items-center justify-between px-4 bg-white z-20 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-bold text-text">Transcript Summarizer</h2>
          </div>
        </header>

        {/* Configuration Bar */}
        <div className="h-[60px] border-b flex items-stretch px-4 gap-6 bg-white shrink-0 overflow-x-auto py-0">
          <SummaryTypeTabs
            summaryType={summaryType}
            onSummaryTypeChange={handleSummaryTypeChange}
            isLoading={isGenerating || isRegenerating}
          />
          <div className="w-[1px] bg-border mx-2"></div>
          <PersonalizationPanel
            style={style}
            onStyleChange={setStyle}
            tonality={tonality}
            onTonalityChange={setTonality}
            isLoading={isGenerating || isRegenerating}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 overflow-y-auto md:overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-full max-w-[1600px] mx-auto">

            {/* Left Card: Input */}
            <Card className="flex flex-col h-full shadow-sm">
              <CardHeader className="p-3 border-b space-y-0 flex flex-row items-center justify-between min-h-[50px]">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-dim">Input Text</CardTitle>
                {/* File upload icon in header */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-text hover:bg-neutral-100 rounded transition-colors"
                  title="Upload .txt file"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (!file.name.endsWith('.txt')) { alert('Please upload a .txt file.'); return; }
                    handleFileUpload(file);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                />
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col min-h-0 bg-surface3/30">
                <TextInput
                  value={inputText}
                  onChange={setInputText}
                />
                {error && (
                  <div className="text-xs text-destructive bg-destructive/10 p-2 rounded mx-4 mb-2">
                    {error}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/10 flex items-center justify-between">
                {/* Left: char count + clear */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{inputText.length} characters</span>
                  {inputText.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClear}
                      className="flex items-center gap-1.5 h-8 px-2 text-xs text-muted-foreground hover:text-text hover:bg-neutral-200 transition-colors"
                      title="Clear input text"
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      Clear Text
                    </Button>
                  )}
                </div>
                {/* Right: generate */}
                <Button
                  onClick={handleSummarize}
                  disabled={isGenerating}
                  className="bg-black text-white hover:bg-neutral-800 hover:text-white transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate"
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Right Card: Output */}
            <Card className="flex flex-col h-full shadow-sm">
              <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 bg-surface3/50 min-h-[50px]">
                <div className="font-semibold text-xs uppercase tracking-wider text-dim">Output</div>
                <LanguageSelector
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={handleLanguageChange}
                  isLoading={isGenerating || isRegenerating}
                />
              </CardHeader>
              <CardContent className="flex-1 p-[1em] overflow-hidden relative">
                <SummaryDisplay
                  summary={displayedSummary}
                  isLoading={isGenerating || isRegenerating}
                  language={selectedLanguage}
                />
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/10 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!displayedSummary}
                  className={`flex items-center gap-1.5 h-8 px-2 text-xs hover:bg-neutral-200 transition-colors ${copied ? 'text-green-600' : 'text-muted-foreground hover:text-text'
                    }`}
                  title="Copy to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={!originalSummary || isRegenerating}
                  className="flex items-center gap-1.5 h-8 px-2 text-xs text-muted-foreground hover:text-text hover:bg-neutral-200 transition-colors"
                  title="Regenerate summary"
                >
                  {isRegenerating
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <RotateCcw className="w-3.5 h-3.5" />}
                  Regenerate
                </Button>
              </CardFooter>
            </Card>

          </div>
        </div>
      </main >
    </div >
  );
}

export default App;
