import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { gridItemsApi } from "@/api/gridItems";

import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalInput } from "@/components/ui/BrutalInput";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalConfirmModal } from "@/components/ui/BrutalConfirmModal";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

type FormState = {
    error: string | null;
    success: boolean;
    message: string | null;
};

function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <BrutalButton type="submit" variant="primary" disabled={pending} className="w-full">
            {pending ? "Publishing..." : label}
        </BrutalButton>
    );
}

export function AdminDevLogPage() {
    const queryClient = useQueryClient();
    const [devLogToDelete, setDevLogToDelete] = useState<string | null>(null);

    // Fetch existing DevLogs
    const { data: existingDevLogs = [], isLoading } = useQuery({
        queryKey: ["admin-devlogs"],
        queryFn: async () => {
            const res = await apiClient.get("/api/grid-items?type=DevLog");
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => gridItemsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-devlogs"] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setDevLogToDelete(null);
        },
        onError: (err: any) => {
            alert("Failed to delete DevLog: " + err.message);
            setDevLogToDelete(null);
        }
    });

    const triggerDelete = (id: string) => {
        setDevLogToDelete(id);
    };

    const confirmDelete = () => {
        if (devLogToDelete) {
            deleteMutation.mutate(devLogToDelete);
        }
    };

    const [markdown, setMarkdown] = useState(`# My DevLog Title

## The Problem

Describe the technical challenge you faced...

## My Solution

\`\`\`tsx
// Your code here
const solution = "elegant";
\`\`\`

## Key Takeaways

1. First lesson learned
2. Second insight
3. What I'd do differently

> **Pro tip**: Always test your edge cases!
`);

    const [state, formAction] = useActionState(
        async (_prevState: FormState, formData: FormData): Promise<FormState> => {
            const title = formData.get("title") as string;
            const category = formData.get("category") as string;
            const content = markdown;

            if (!title || !content) {
                return { error: "Title and content are required.", success: false, message: null };
            }

            try {
                await apiClient.post("/api/grid-items", {
                    type: "DevLog",
                    title,
                    content,
                    tags: category ? [category] : [],
                    color: "purple", // Default color for text focus
                    gridSpanX: 2,
                    gridSpanY: 2
                });

                queryClient.invalidateQueries({ queryKey: ["admin-devlogs"] });
                queryClient.invalidateQueries({ queryKey: ["grid-items"] });
                setMarkdown("");

                return { error: null, success: true, message: `DevLog "${title}" published!` };
            } catch (err: any) {
                return { error: err.message || "Failed to publish DevLog", success: false, message: null };
            }
        },
        { error: null, success: false, message: null }
    );

    return (
        <div className="max-w-[1400px]">
            <h1 className="font-heading text-3xl font-bold mb-8">
                DevLog Editor
                <span className="text-brutal-red">.</span>
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Form Area */}
                <div className="xl:col-span-3">
                    <form action={formAction} className="flex flex-col gap-6">
                        {/* Meta Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <BrutalInput name="title" label="Title" placeholder="React 19 useActionState: A Complete Guide" required />
                            <BrutalInput name="category" label="Category" placeholder="React, .NET, DevOps, Design..." />
                        </div>

                        {/* Dual-Pane Editor */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-2 border-brutal-border shadow-[4px_4px_0px_0px_var(--theme-border)]">
                            {/* Editor Pane */}
                            <div className="flex flex-col">
                                <div className="bg-brutal-bg border-b-2 border-brutal-border text-brutal-black px-4 py-2.5 font-heading font-bold text-sm flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BrutalBadge color="yellow" className="text-black text-xs py-0.5 px-2">EDIT</BrutalBadge>
                                        <span>Markdown Source</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-brutal-muted">Auto-saves in memory</span>
                                </div>
                                <textarea
                                    value={markdown}
                                    onChange={(e) => setMarkdown(e.target.value)}
                                    className="flex-1 min-h-[500px] p-4 font-mono text-sm bg-brutal-white text-brutal-black
                                               border-b-2 lg:border-b-0 lg:border-r-2 border-brutal-border resize-none
                                               focus:outline-none focus:bg-brutal-bg/30 transition-colors"
                                    spellCheck={false}
                                />
                            </div>

                            {/* Preview Pane */}
                            <div className="flex flex-col">
                                <div className="bg-brutal-bg border-b-2 border-brutal-border text-brutal-black px-4 py-2.5 font-heading font-bold text-sm flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <BrutalBadge color="cyan" className="text-black text-xs py-0.5 px-2">PREVIEW</BrutalBadge>
                                        <span>Rendered HTML</span>
                                    </div>
                                    <span className="font-mono text-[10px] text-brutal-muted">Live sync</span>
                                </div>
                                <div className="flex-1 min-h-[500px] p-6 bg-brutal-white text-brutal-black overflow-auto brutal-prose font-mono text-base max-w-none">
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {markdown || '*Start typing markdown in the editor...*'}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        </div>

                        {/* Status Messages */}
                        {state.error && (
                            <div className="bg-brutal-red text-white px-4 py-2 border-2 border-brutal-border font-bold text-sm">
                                ⚠ {state.error}
                            </div>
                        )}
                        {state.success && (
                            <div className="bg-brutal-green text-black px-4 py-2 border-2 border-brutal-border font-bold text-sm">
                                ✓ {state.message}
                            </div>
                        )}

                        <SubmitButton label="Publish DevLog" />
                    </form>
                </div>

                {/* Existing DevLogs Sidebar */}
                <div className="xl:col-span-1">
                    <BrutalCard color="white" className="h-[400px] xl:h-[calc(100vh-200px)] flex flex-col xl:sticky xl:top-6">
                        <div className="flex items-center justify-between mb-4 border-b-2 border-brutal-border pb-3 shrink-0">
                            <h2 className="font-heading text-lg font-bold">Existing DevLogs</h2>
                            <BrutalBadge color="purple" className="text-xs py-0.5 px-2">{existingDevLogs.length}</BrutalBadge>
                        </div>
                        <ul className="flex flex-col gap-3 overflow-y-auto pr-2 pb-4 flex-1">
                            {isLoading ? (
                                <li className="p-4 text-center font-mono text-xs text-brutal-muted">Loading DevLogs...</li>
                            ) : existingDevLogs.length === 0 ? (
                                <li className="p-4 text-center font-mono text-xs text-brutal-muted">No DevLogs published yet.</li>
                            ) : (
                                existingDevLogs.map((p: any) => (
                                    <li key={p.id} className="relative flex flex-col gap-2 bg-brutal-bg border-2 border-brutal-border p-4 hover:border-brutal-purple transition-all group">
                                        <div className="flex flex-col items-start gap-2 pr-8">
                                            <span className="font-heading font-bold text-sm break-words text-brutal-black">{p.title}</span>
                                            {p.tags && p.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {p.tags.map((tag: string) => (
                                                        <BrutalBadge key={tag} color="cyan" className="text-[10px] py-0 px-1.5">{tag}</BrutalBadge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => triggerDelete(p.id)}
                                            className="absolute top-2 right-2 bg-brutal-red text-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all p-1.5 cursor-pointer"
                                            title="Delete DevLog"
                                        >
                                            <X className="w-3.5 h-3.5" strokeWidth={3} />
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </BrutalCard>
                </div>
            </div>

            <BrutalConfirmModal
                isOpen={!!devLogToDelete}
                title="Delete DevLog?"
                message="Are you sure you want to delete this DevLog? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setDevLogToDelete(null)}
            />
        </div>
    );
}
