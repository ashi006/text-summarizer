import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export interface SummarizeOptions {
    summary_type?: string;
    style?: string;
    tonality?: string;
}

export const summarize = async (text: string, options: SummarizeOptions = {}) => {
    const response = await api.post('/summarize', {
        text,
        ...options,
    });
    return response.data;
};

export const translate = async (text: string, targetLanguage: string) => {
    const response = await api.post('/translate', {
        text,
        target_language: targetLanguage,
    });
    return response.data;
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default {
    summarize,
    translate,
    uploadFile,
};
