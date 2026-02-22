import { useEffect, useState } from 'react';

const DEVICE_ID_KEY = 'gosta_device_id';

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

export function useDeviceId(): string {
    const [deviceId, setDeviceId] = useState<string>('');

    useEffect(() => {
        let id = localStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
            id = generateUUID();
            localStorage.setItem(DEVICE_ID_KEY, id);
        }
        setDeviceId(id);
    }, []);

    return deviceId;
}
