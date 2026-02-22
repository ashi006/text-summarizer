import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './ui/button';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({
    open,
    title,
    message,
    confirmLabel = 'Remove',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
}: ConfirmDialogProps) => {
    // Close on Escape key
    useEffect(() => {
        if (!open) return;
        const handle = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handle);
        return () => window.removeEventListener('keydown', handle);
    }, [open, onCancel]);

    if (!open) return null;

    // Use Portal to render at body level, avoiding parent transform stacking contexts
    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl shadow-2xl border border-border w-[320px] p-5 flex flex-col gap-4 animate-in fade-in zoom-in duration-200"
                onClick={(e) => e.stopPropagation()}
                style={{ boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
            >
                {/* Header */}
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 px-3 hover:bg-muted hover:text-foreground"
                        onClick={onCancel}
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs h-8 px-3"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;
