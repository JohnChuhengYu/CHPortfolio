import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ArrowLeft, Edit3, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CommentSection } from "@/components/comments/CommentSection";
import { GodModeActionBar } from "@/components/GodModeActionBar";

export function DevLogDetailPage() {
    const { id } = useParams();
    const { isAdminModeEnbaled } = useAuth();
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<any>(null);
    const [previewMode, setPreviewMode] = useState<"edit" | "preview">("edit");

    const { data: logData, isLoading, isError } = useQuery({
        queryKey: ["devlog", id],
        queryFn: async () => {
            const res = await apiClient.get(`/api/grid-items/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    const handleEdit = (field: string, value: string) => {
        setEditData((prev: any) => ({
            ...(prev || logData),
            [field]: value
        }));
    };

    const updateMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            await apiClient.put(`/api/grid-items/${id}`, updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devlog", id] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setEditData(null);
        }
    });

    if (isLoading) return <div className="p-8 font-heading text-2xl font-black text-brutal-black">LOADING DEVLOG...</div>;
    if (isError || !logData) {
        return (
            <div className="max-w-3xl w-full mx-auto px-6 py-16 text-center text-brutal-black">
                <h1 className="font-heading text-4xl mb-6">DevLog Not Found</h1>
                <Link to="/devlog">
                    <BrutalButton>Go Back</BrutalButton>
                </Link>
            </div>
        );
    }

    const displayData = editData || logData;
    const category = displayData.tags?.[0] || (displayData.color === "cyan" ? "React" : displayData.color === "purple" ? ".NET" : "DevOps");
    const date = new Date(displayData.createdAt).toISOString().split('T')[0];

    return (
        <div className="max-w-4xl w-full mx-auto px-6 py-16 text-brutal-black relative pb-32">
            {/* Back Navigation */}
            <Link to="/devlog" className="inline-block mb-8">
                <BrutalButton variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to DevLog
                </BrutalButton>
            </Link>

            {/* Article Header */}
            <header className="mb-10">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <BrutalBadge color="cyan">{category}</BrutalBadge>
                    <span className="font-mono text-sm text-brutal-muted">{date}</span>
                    <span className="font-mono text-sm text-brutal-muted">· 5 min read</span>
                </div>

                {isAdminModeEnbaled ? (
                    <div className="flex flex-col gap-2 p-5 bg-brutal-white border-2 border-brutal-border shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] mb-4">
                        <div className="flex items-center justify-between">
                            <label className="font-heading font-bold text-xs uppercase text-brutal-muted">
                                DevLog Title
                            </label>
                            <span className="text-xs font-heading font-black text-brutal-pink uppercase flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-brutal-pink inline-block animate-pulse"></span>
                                Live Editing
                            </span>
                        </div>
                        <input
                            value={displayData.title || ''}
                            onChange={(e) => handleEdit('title', e.target.value)}
                            className="w-full font-heading text-2xl sm:text-4xl font-bold leading-tight border-2 border-brutal-border p-3.5 bg-brutal-bg text-brutal-black outline-none focus:ring-2 focus:ring-brutal-yellow transition-all"
                            placeholder="TITLE"
                        />
                    </div>
                ) : (
                    <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-2 text-brutal-black">
                        {displayData.title}
                    </h1>
                )}

                <p className="font-mono text-xs text-brutal-muted mt-2">
                    RECORD ID: <code className="bg-brutal-yellow text-black px-1.5 py-0.5 border border-black dark:border-gray-700 font-bold">{id}</code>
                </p>
            </header>

            {/* Article Body */}
            {isAdminModeEnbaled ? (
                <div className="bg-brutal-white border-2 border-brutal-border shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] p-4 sm:p-6 mb-12">
                    {/* Mode Tabs */}
                    <div className="flex items-center justify-between border-b-2 border-brutal-border pb-3 mb-4 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setPreviewMode("edit")}
                                className={`px-3 py-1 font-heading font-bold text-xs uppercase border-2 border-brutal-border flex items-center gap-1.5 transition-all cursor-pointer ${
                                    previewMode === "edit"
                                        ? "bg-brutal-yellow text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                                        : "bg-brutal-bg text-brutal-muted hover:text-brutal-black"
                                }`}
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                Edit Markdown
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewMode("preview")}
                                className={`px-3 py-1 font-heading font-bold text-xs uppercase border-2 border-brutal-border flex items-center gap-1.5 transition-all cursor-pointer ${
                                    previewMode === "preview"
                                        ? "bg-brutal-cyan text-black shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                                        : "bg-brutal-bg text-brutal-muted hover:text-brutal-black"
                                }`}
                            >
                                <Eye className="w-3.5 h-3.5" />
                                Live Preview
                            </button>
                        </div>
                        <span className="font-mono text-xs text-brutal-muted">
                            Highlight.js syntax highlighting enabled
                        </span>
                    </div>

                    {previewMode === "edit" ? (
                        <textarea
                            value={displayData.content || ''}
                            onChange={(e) => handleEdit('content', e.target.value)}
                            className="w-full h-[520px] bg-brutal-bg border-2 border-brutal-border p-4 outline-none resize-y font-mono text-sm sm:text-base text-brutal-black focus:ring-2 focus:ring-brutal-yellow transition-colors leading-relaxed"
                            placeholder="Write your markdown post content here..."
                        />
                    ) : (
                        <div className="min-h-[520px] p-4 bg-brutal-bg border-2 border-brutal-border overflow-auto">
                            <article className="brutal-prose max-w-none font-mono text-brutal-black">
                                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                    {displayData.content || '*No content provided yet.*'}
                                </ReactMarkdown>
                            </article>
                        </div>
                    )}
                </div>
            ) : (
                <article className="brutal-prose mt-6 max-w-none font-mono text-brutal-black">
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {displayData.content || '*No content provided.*'}
                    </ReactMarkdown>
                </article>
            )}

            {/* Comment Section */}
            {!isAdminModeEnbaled && id && (
                <CommentSection gridItemId={id} />
            )}

            {/* God Mode Action Bar */}
            {isAdminModeEnbaled && (
                <GodModeActionBar
                    hasChanges={!!editData}
                    isSaving={updateMutation.isPending}
                    onSave={() => updateMutation.mutate(editData)}
                    onDiscard={() => setEditData(null)}
                    title="Editing DevLog"
                />
            )}
        </div>
    );
}

