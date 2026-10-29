import { Zap, Save, RotateCcw, CheckCircle2, Loader2 } from "lucide-react";

interface GodModeActionBarProps {
    hasChanges: boolean;
    isSaving: boolean;
    onSave: () => void;
    onDiscard: () => void;
    title?: string;
}

export function GodModeActionBar({
    hasChanges,
    isSaving,
    onSave,
    onDiscard,
    title = "Live Editing",
}: GodModeActionBarProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[95vw] animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-wrap items-center gap-3 px-4 py-2.5 bg-brutal-white text-brutal-black border-2 border-brutal-border shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] rounded-none">
                {/* Status Indicator */}
                <div className="flex items-center gap-2 pr-3 border-r-2 border-brutal-border">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brutal-pink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-brutal-pink"></span>
                    </span>
                    <span className="font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1 text-brutal-pink">
                        <Zap className="w-3.5 h-3.5" />
                        GOD MODE
                    </span>
                </div>

                {/* State description */}
                <div className="font-mono text-xs hidden sm:flex items-center gap-1 text-brutal-muted">
                    {hasChanges ? (
                        <span className="text-brutal-yellow font-bold uppercase bg-black px-1.5 py-0.5 border border-black dark:border-gray-700">
                            Unsaved Changes
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-brutal-muted">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                            {title}
                        </span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {hasChanges && (
                        <button
                            type="button"
                            onClick={onDiscard}
                            disabled={isSaving}
                            className="px-3 py-1.5 font-heading font-bold text-xs uppercase border-2 border-brutal-border bg-brutal-bg text-brutal-black hover:bg-brutal-red hover:text-white transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Discard
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={onSave}
                        disabled={!hasChanges || isSaving}
                        className={`px-4 py-1.5 font-heading font-black text-xs uppercase border-2 border-brutal-border flex items-center gap-1.5 transition-all cursor-pointer ${
                            hasChanges
                                ? "bg-brutal-pink text-white hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1"
                                : "bg-gray-200 dark:bg-gray-800 text-gray-400 border-gray-400 dark:border-gray-700 cursor-not-allowed opacity-60"
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
