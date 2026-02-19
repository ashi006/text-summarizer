import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Label } from "./ui/label";

interface PersonalizationPanelProps {
    style: string;
    onStyleChange: (style: string) => void;
    tonality: string;
    onTonalityChange: (tonality: string) => void;
    isLoading: boolean;
}

const PersonalizationPanel = ({
    style,
    onStyleChange,
    tonality,
    onTonalityChange,
    isLoading
}: PersonalizationPanelProps) => {

    return (
        <div className="flex h-full items-center gap-6">
            {/* Style Selection */}
            <div className="flex flex-col justify-center h-full space-y-1.5 min-w-max">
                <Label className="text-[10.5px] uppercase tracking-wider font-semibold text-dim">Output Format</Label>
                <div className="seg-ctrl bg-surface2 rounded-lg p-[3px] flex gap-[2px] border border-border">
                    <ToggleGroup
                        type="single"
                        value={style}
                        onValueChange={(val) => { if (val) onStyleChange(val); }}
                        className="gap-0"
                    >
                        <ToggleGroupItem value="paragraph" disabled={isLoading} className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm">Paragraph</ToggleGroupItem>
                        <ToggleGroupItem value="bullets" disabled={isLoading} className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm">Bullets</ToggleGroupItem>
                        <ToggleGroupItem value="numbered" disabled={isLoading} className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm">Numbered</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div >

            <div className="w-[1px] h-full bg-border mx-2"></div>

            {/* Tonality Selection */}
            < div className={`flex flex-col justify-center h-full space-y-1.5 min-w-max`}>
                <Label className="text-[10.5px] uppercase tracking-wider font-semibold text-dim">Summary Tone</Label>
                <div className="seg-ctrl bg-surface2 rounded-lg p-[3px] flex gap-[2px] border border-border">
                    <ToggleGroup
                        type="single"
                        value={tonality}
                        onValueChange={(val) => { if (val) onTonalityChange(val); }}
                        className="gap-0"
                    >
                        <ToggleGroupItem value="professional" disabled={isLoading} className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm">Professional</ToggleGroupItem>
                        <ToggleGroupItem value="casual" disabled={isLoading} className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm">Casual</ToggleGroupItem>
                        <ToggleGroupItem value="simplified" disabled={isLoading} className="text-[12px] font-medium text-muted-foreground h-[28px] px-3 rounded-[6px] hover:text-text transition-all data-[state=on]:bg-green-200 data-[state=on]:text-green-800 data-[state=on]:shadow-sm">Simplified</ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </div>
        </div>
    );
};

export default PersonalizationPanel;
