import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Label } from "./ui/label";

interface SummaryTypeTabsProps {
    summaryType: string;
    onSummaryTypeChange: (type: string) => void;
    isLoading: boolean;
}

const SummaryTypeTabs = ({ summaryType, onSummaryTypeChange, isLoading }: SummaryTypeTabsProps) => {
    return (
        <div className="flex flex-col justify-center h-full space-y-1.5 min-w-max">
            <Label className="text-[10.5px] uppercase tracking-wider font-semibold text-dim">Summary Type</Label>
            <div className="seg-ctrl bg-surface2 rounded-lg p-[3px] flex gap-[2px] border border-border">
                <ToggleGroup
                    type="single"
                    value={summaryType}
                    onValueChange={(val) => { if (val) onSummaryTypeChange(val); }}
                    className="gap-0"
                >
                    <ToggleGroupItem value="brief" className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm" disabled={isLoading}>Brief</ToggleGroupItem>
                    <ToggleGroupItem value="detailed" className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm" disabled={isLoading}>Detailed</ToggleGroupItem>
                    <ToggleGroupItem value="key_points" className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm" disabled={isLoading}>Key Points</ToggleGroupItem>
                    <ToggleGroupItem value="action_points" className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm" disabled={isLoading}>Action Points</ToggleGroupItem>
                </ToggleGroup>
            </div>
        </div>
    );
};

export default SummaryTypeTabs;
