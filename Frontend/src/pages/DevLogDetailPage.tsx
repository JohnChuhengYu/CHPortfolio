import { useState } from "react";
import { useParams, Link } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CommentSection } from "@/components/comments/CommentSection";

export function DevLogDetailPage() {
    const { id } = useParams();
    const { isAdminModeEnbaled } = useAuth();
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<any>(null);

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

    if (isLoading) return <div className="p-8 font-heading text-2xl font-black">LOADING DEVLOG...</div>;
    if (isError || !logData) {
        return (
            <div className="max-w-3xl w-full mx-auto px-6 py-16 text-center">
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
        <div className="max-w-3xl w-full mx-auto px-6 py-16">
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
                    <span className="font-mono text-sm text-brutal-muted">· {"5 min read"}</span>
                </div>
                {isAdminModeEnbaled ? (
                    <input
                        value={displayData.title || ''}
                        onChange={(e) => handleEdit('title', e.target.value)}
                        className="w-full font-heading text-4xl md:text-5xl font-bold leading-tight border-4 border-black dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800 outline-none focus:bg-brutal-yellow mb-2"
                        placeholder="TITLE"
                    />
                ) : (
                    <h1 className="font-heading text-4xl md:text-5xl font-bold leading-tight mb-2">
                        {displayData.title}
                    </h1>
                )}
                <p className="font-mono text-sm text-brutal-muted mt-2">
                    ID: <code className="bg-brutal-yellow text-black px-1 border border-black dark:border-gray-700">{id}</code>
                </p>
            </header>

            {/* Article Body — using brutal-prose for Markdown-like styling */}
            <article className="brutal-prose mt-6 prose prose-lg prose-brutal max-w-none font-mono">
                {isAdminModeEnbaled ? (
                    <textarea
                        value={displayData.content || ''}
                        onChange={(e) => handleEdit('content', e.target.value)}
                        className="w-full h-[500px] mt-6 bg-brutal-white border-4 border-black dark:border-gray-700 p-4 outline-none resize-y font-mono text-lg text-brutal-black focus:bg-brutal-cyan/10 transition-colors"
                        placeholder="MARKDOWN CONTENT..."
                    />
                ) : (
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                        {displayData.content || '*No content provided.*'}
                    </ReactMarkdown>
                )}
            </article>

            {/* Comment Section */}
            {!isAdminModeEnbaled && id && (
                <CommentSection gridItemId={id} />
            )}

            {/* Admin Save Button */}
            {isAdminModeEnbaled && editData && (
                <button
                    onClick={() => updateMutation.mutate(editData)}
                    disabled={updateMutation.isPending}
                    className="fixed bottom-12 right-12 z-50 bg-brutal-pink border-4 border-black dark:border-gray-700 px-8 py-6 font-heading font-black text-4xl uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all flex items-center gap-4 text-white cursor-pointer"
                >
                    <Save className="w-10 h-10" />
                    {updateMutation.isPending ? "SAVING..." : "SAVE CHANGES"}
                </button>
            )}
        </div>
    );
}
