import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
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

export default {
    summarize,
    translate,
};
