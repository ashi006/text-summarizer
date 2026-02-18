import React, { useRef } from 'react';

interface FileUploadProps {
    onUpload: (file: File) => void;
    isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, isLoading }) => {
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
        <div className="file-upload" style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Or upload a transcript file (.txt)
            </label>
            <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={isLoading}
                ref={fileInputRef}
                style={{
                    padding: '8px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: '#fff',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            />
        </div>
    );
};

export default FileUpload;
