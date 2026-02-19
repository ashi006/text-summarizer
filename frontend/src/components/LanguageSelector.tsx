import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import { Label } from "./ui/label";

interface LanguageSelectorProps {
    selectedLanguage: string;
    onLanguageChange: (lang: string) => void;
    isLoading?: boolean;
}

const languages = [
    { code: 'en', name: 'English' },
    { code: 'fi', name: 'Finnish' },
    { code: 'sv', name: 'Swedish' },
    { code: 'ar', name: 'Arabic' },
    { code: 'ur', name: 'Urdu' },
];

const LanguageSelector = ({ selectedLanguage, onLanguageChange, isLoading }: LanguageSelectorProps) => {
    return (
        <div className="flex items-center gap-2">
            <Label htmlFor="language-select" className="whitespace-nowrap">Translate to:</Label>
            <Select value={selectedLanguage} onValueChange={onLanguageChange} disabled={isLoading}>
                <SelectTrigger className="w-[140px] h-[32px] text-xs">
                    <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="original">Original Language</SelectItem>
                    {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSelector;
