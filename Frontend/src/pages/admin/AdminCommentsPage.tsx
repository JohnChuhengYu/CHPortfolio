import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { Trash2, MessageSquare, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { BrutalBadge } from "@/components/ui/BrutalBadge";

interface Comment {
    id: string;
    gridItemId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
    itemTitle?: string;
    itemType?: string;
}

const BRUTAL_COLORS = [
    "yellow", "purple", "cyan", "pink", "blue", "green", "orange",
    "lime", "indigo", "rose", "amber", "emerald", "fuchsia", "violet", "sky"
] as const;

export function AdminCommentsPage() {
    const queryClient = useQueryClient();

    // Helper to get consistent color from a string
    const getColorFromString = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        // Use the full range of colors (excluding red which is for deletion)
        const index = Math.abs(hash) % BRUTAL_COLORS.length;
        return BRUTAL_COLORS[index];
    };

    const getRedirectPath = (type: string | undefined, id: string) => {
        const t = type?.toLowerCase();
        if (t === "daily") return `/daily/${id}`;
        if (t === "devlog") return `/devlog/${id}`;
        return `/project/${id}`;
    };

    // Fetch all comments
    const { data: comments, isLoading, error, isError } = useQuery<Comment[]>({
        queryKey: ["admin-comments"],
        queryFn: async () => {
            const res = await apiClient.get("/api/comments");
            return res.data;
        },
        retry: false, // Don't retry admin access errors
    });

    // Delete comment
    const deleteMutation = useMutation({
        mutationFn: async (commentId: string) => {
            await apiClient.delete(`/api/comments/${commentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
        },
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="font-heading font-black text-2xl animate-pulse uppercase">
                    Loading Comments...
                </div>
            </div>
        );
    }

    if (isError) {
        const isForbidden = (error as any)?.response?.status === 403;
        return (
            <div className="border-4 border-black bg-brutal-red/10 p-12 text-center brutal-shadow">
                <h2 className="font-heading font-black text-3xl uppercase mb-4">
                    {isForbidden ? "Access Denied" : "Error Loading Comments"}
                </h2>
                <p className="font-mono font-bold text-gray-700 dark:text-gray-300 mb-8 uppercase">
                    {isForbidden
                        ? "Your account does not have permission to moderate comments."
                        : "Something went wrong while fetching the comments."}
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["admin-comments"] })}
                        className="bg-brutal-black text-brutal-bg px-8 py-3 font-heading font-black uppercase border-4 border-brutal-border shadow-[4px_4px_0px_0px_var(--theme-border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        Try Again
                    </button>
                    <Link to="/" className="bg-brutal-white text-brutal-black px-8 py-3 font-heading font-black uppercase border-4 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-12">
                <h1 className="font-heading text-4xl font-black uppercase mb-2">
                    Comment Management
                    <span className="text-brutal-pink">.</span>
                </h1>
                <p className="font-mono text-gray-600 dark:text-gray-400 font-bold uppercase">
                    Moderate user discussions across your portfolio.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className="bg-brutal-white border-4 border-brutal-border p-6 hover:shadow-[8px_8px_0px_0px_var(--theme-border)] transition-all brutal-shadow-sm group relative"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b-2 border-dashed border-brutal-border">
                                <div className="flex items-center gap-3">
                                    <div className="bg-brutal-yellow border-2 border-brutal-border w-10 h-10 flex items-center justify-center font-heading font-black text-black">
                                        {comment.userName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-heading font-black text-lg leading-tight uppercase text-brutal-black">
                                            {comment.userName.split('@')[0]}
                                        </p>
                                        <p className="font-mono text-[10px] text-brutal-muted font-bold uppercase">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <BrutalBadge
                                        color={getColorFromString(comment.itemTitle || "Unknown Item")}
                                        className="px-3 py-2 gap-2 mt-1"
                                    >
                                        <MessageSquare className="w-3 h-3 shrink-0" />
                                        <span className="break-words max-w-[150px] text-[10px] leading-tight">
                                            {comment.itemTitle || "Unknown Item"}
                                        </span>
                                    </BrutalBadge>
                                    <Link
                                        to={getRedirectPath(comment.itemType, comment.gridItemId)}
                                        className="text-brutal-black hover:bg-brutal-yellow transition-all hover:scale-110 border-2 border-brutal-border p-1.5 bg-brutal-white shadow-none hover:shadow-[2px_2px_0px_0px_var(--theme-border)] mr-6"
                                        title="View Page"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            <p className="font-mono text-brutal-black whitespace-pre-wrap mb-4">
                                {comment.content}
                            </p>

                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this comment?")) {
                                        deleteMutation.mutate(comment.id);
                                    }
                                }}
                                disabled={deleteMutation.isPending}
                                className="md:absolute md:-top-4 md:-right-4 bg-brutal-red text-white p-3 border-4 border-brutal-border shadow-[4px_4px_0px_0px_var(--theme-border)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50 flex items-center gap-2 font-heading font-black uppercase text-xs"
                            >
                                <Trash2 className="w-4 h-4" />
                                {deleteMutation.isPending && "Deleting..."}
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="border-4 border-black border-dashed p-12 text-center">
                        <p className="font-heading font-black text-2xl text-gray-400 uppercase">
                            No comments yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
