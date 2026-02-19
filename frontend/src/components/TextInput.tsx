import { Textarea } from "./ui/textarea";

interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
    return (
        <Textarea
            placeholder="Paste your medical transcript here..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 h-full text-sm font-mono resize-none"
        />
    );
};

export default TextInput;
