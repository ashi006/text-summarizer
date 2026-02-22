import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

export interface HistoryItem {
    id: string;
    title: string;
    input_text: string;
    summary: string;
    translated_summary: string | null;
    summary_type: string;
    style: string;
    tonality: string;
    language: string;
    created_at: string;
}

export interface SaveHistoryPayload {
    input_text: string;
    summary: string;
    translated_summary?: string | null;
    summary_type?: string;
    style?: string;
    tonality?: string;
    language?: string;
}

function getHeaders(deviceId: string) {
    return { 'X-Device-Id': deviceId };
}

export const saveHistory = async (
    deviceId: string,
    payload: SaveHistoryPayload
): Promise<HistoryItem> => {
    const response = await api.post('/history', payload, {
        headers: getHeaders(deviceId),
    });
    return response.data;
};

export const getHistory = async (
    deviceId: string,
    skip = 0,
    limit = 10,
): Promise<{ items: HistoryItem[]; has_more: boolean }> => {
    const response = await api.get('/history', {
        headers: getHeaders(deviceId),
        params: { skip, limit },
    });
    return response.data;
};

export const loadSummary = async (
    deviceId: string,
    summaryId: string
): Promise<HistoryItem> => {
    const response = await api.get(`/history/${summaryId}`, {
        headers: getHeaders(deviceId),
    });
    return response.data;
};

export const deleteSummary = async (
    deviceId: string,
    summaryId: string
): Promise<void> => {
    await api.delete(`/history/${summaryId}`, {
        headers: getHeaders(deviceId),
    });
};

export default { saveHistory, getHistory, loadSummary, deleteSummary };
