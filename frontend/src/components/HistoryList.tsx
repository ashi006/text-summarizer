import { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import type { HistoryItem } from '../services/historyApi';
import ConfirmDialog from './ConfirmDialog';

interface HistoryListProps {
    items: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
    activeId: string | null;
    hasMore: boolean;
    onLoadMore: () => void;
}

function formatDate(iso: string): string {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const HistoryList = ({ items, onSelect, onDelete, activeId, hasMore, onLoadMore }: HistoryListProps) => {
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    // Sentinel div at bottom of list — triggers load when scrolled into view
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!hasMore) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) onLoadMore();
            },
            { threshold: 0.1 }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, onLoadMore, items.length]);

    const handleDeleteClick = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setPendingDeleteId(id);
    };

    const handleConfirm = () => {
        if (pendingDeleteId) onDelete(pendingDeleteId);
        setPendingDeleteId(null);
    };

    const handleCancel = () => setPendingDeleteId(null);

    if (items.length === 0) {
        return (
            <div className="text-xs text-muted-foreground text-center mt-4 px-2">
                No summaries yet
            </div>
        );
    }

    return (
        <>
            <div className="mt-3 flex flex-col gap-1 overflow-y-auto flex-1">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`group relative flex items-start rounded-md px-2 py-2 text-xs cursor-pointer transition-colors ${item.id === activeId
                                ? 'bg-primary/15 border-l-2 border-primary pl-[6px]'
                                : 'hover:bg-muted/60'
                            }`}
                        onClick={() => onSelect(item)}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-foreground truncate leading-tight">
                                {item.title || 'Untitled'}
                            </div>
                            <div className="text-muted-foreground mt-0.5 text-[10px]">
                                {formatDate(item.created_at)}
                            </div>
                            <div className="mt-0.5">
                                <span className="inline-block bg-primary/10 text-primary rounded px-1 text-[9px] font-medium capitalize">
                                    {item.summary_type}
                                </span>
                            </div>
                        </div>
                        <button
                            className="opacity-0 group-hover:opacity-100 ml-1 mt-0.5 p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all shrink-0"
                            onClick={(e) => handleDeleteClick(e, item.id)}
                            title="Remove from history"
                        >
                            <Trash2 size={11} />
                        </button>
                    </div>
                ))}

                {/* Infinite scroll sentinel */}
                {hasMore && (
                    <div ref={sentinelRef} className="py-2 flex justify-center">
                        <span className="text-[10px] text-muted-foreground/50">Loading…</span>
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={pendingDeleteId !== null}
                title="Remove from history?"
                message="This will remove the summary from your history list."
                confirmLabel="Remove"
                cancelLabel="Cancel"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
            />
        </>
    );
};

export default HistoryList;
