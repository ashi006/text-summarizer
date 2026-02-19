import { useRef } from 'react';
import { FileText } from 'lucide-react';

interface FileUploadProps {
    onUpload: (file: File) => void;
    isLoading: boolean;
}

const FileUpload = ({ onUpload, isLoading }: FileUploadProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith('.txt')) {
            alert('Please upload a .txt file.');
            return;
        }

        onUpload(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div
            className="flex items-center gap-3 p-3 border-2 border-dashed border-border2 rounded-xl bg-surface cursor-pointer hover:bg-accent-bg hover:border-accent transition-colors group"
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={isLoading}
                ref={fileInputRef}
                className="hidden"
            />

            {/* Icon Wrap */}
            <div className="w-9 h-9 bg-surface2 border border-border rounded-lg flex items-center justify-center text-base shrink-0 text-muted-foreground group-hover:bg-accent-bg group-hover:border-accent-border group-hover:text-accent transition-colors">
                <FileText className="w-4 h-4" />
            </div>

            {/* Text Wrap */}
            <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-text">Drop a file or click to upload</div>
                <div className="text-[11px] text-muted-foreground font-mono mt-[1px]">.txt files only</div>
            </div>

            {/* Browse Button */}
            <div className="ml-auto text-[11.5px] font-medium px-2.5 py-1.5 border border-border2 rounded bg-surface text-text-2 browse-btn shadow-sm">
                Browse
            </div>
        </div>
    );
};

export default FileUpload;
