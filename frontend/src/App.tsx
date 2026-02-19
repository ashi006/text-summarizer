import { useState, useEffect, useRef } from 'react';
import TextInput from './components/TextInput';
import SummaryDisplay from './components/SummaryDisplay';
import LanguageSelector from './components/LanguageSelector';
import PersonalizationPanel from './components/PersonalizationPanel';
import SummaryTypeTabs from './components/SummaryTypeTabs';
import api from './services/api';
import { Loader2, Copy, Paperclip, RotateCcw, Eraser } from "lucide-react";
import logo from './assets/logo.svg';
import { Card, CardContent, CardTitle, CardHeader, CardFooter } from "./components/ui/card";
import { Button } from "./components/ui/button";
// import { Separator } from "@radix-ui/react-select"; // Wait, I didn't create Separator component, just use div or border

function App() {
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
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!inputText.trim() && !originalSummary.trim()) return; // Nothing to regenerate from

    setIsRegenerating(true);
    setError(null);
    setSelectedLanguage(''); // Reset language on regeneration

    try {
      // Regenerate from the original input text if available, otherwise from the last original summary
      const textToSummarize = inputText.trim() ? inputText : originalSummary;
      const result = await api.summarize(textToSummarize, {
        style,
        tonality,
        summary_type: summaryType
      });
      setOriginalSummary(result.summary);
      setDisplayedSummary(result.summary);
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
      return;
    }

    if (!originalSummary) return;

    setIsGenerating(true); // Using isGenerating for translation as well, or could introduce isTranslating
    setError(null);
    try {
      const result = await api.translate(originalSummary, lang);
      setDisplayedSummary(result.translated_text);
      localStorage.setItem('last_displayed_summary', result.translated_text);
      localStorage.setItem('last_language', lang);
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

  const handleSummaryTypeChange = (type: string) => {
    setSummaryType(type);
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-[180px] border-r bg-muted/30 flex flex-col p-3 hidden md:flex">
        <div className="mb-6 text-center">
          <img src={logo} alt="GOSTA Labs" className="h-[50px] mx-auto mb-0" />
          <div className="text-sm font-bold text-center">GOSTA Labs</div>
        </div>

        <Button className="w-full mb-auto gap-2" size="sm">
          <span>+</span> New summary
        </Button>

        <div className="mt-auto pt-4 border-t">
          <div className="text-xs font-semibold text-muted-foreground mb-2">
            Context
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted-foreground/20"></div>
            <span className="text-xs">Medical User</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[var(--bg)]">
        {/* Top Header */}
        <header className="h-[50px] border-b flex items-center justify-between px-4 bg-white z-20">
          <h2 className="text-lg font-bold text-text">Transcript Summarizer</h2>
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
        <div className="flex-1 p-4 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full max-w-[1600px] mx-auto">

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
                />
              </CardContent>
              <CardFooter className="p-4 border-t bg-muted/10 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(displayedSummary)}
                  disabled={!displayedSummary}
                  className="flex items-center gap-1.5 h-8 px-2 text-xs text-muted-foreground hover:text-text hover:bg-neutral-200 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy
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
