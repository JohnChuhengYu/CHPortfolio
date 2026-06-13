import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { useAuth } from "@/hooks/useAuth";
import { Send, Trash2 } from "lucide-react";

interface CommentSectionProps {
    gridItemId: string;
}

interface Comment {
    id: string;
    gridItemId: string;
    userId: string;
    userName: string;
    content: string;
    createdAt: string;
}

export function CommentSection({ gridItemId }: CommentSectionProps) {
    const { user, isLoggedIn, isAdminModeEnbaled } = useAuth();
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState("");

    // Fetch comments
    const { data: comments, isLoading } = useQuery<Comment[]>({
        queryKey: ["comments", gridItemId],
        queryFn: async () => {
            const res = await apiClient.get(`/api/comments/grid-item/${gridItemId}`);
            return res.data;
        },
        enabled: !!gridItemId,
    });

    // Create comment
    const createMutation = useMutation({
        mutationFn: async (content: string) => {
            await apiClient.post("/api/comments", { gridItemId, content });
        },
        onSuccess: () => {
            setNewComment("");
            queryClient.invalidateQueries({ queryKey: ["comments", gridItemId] });
        },
    });

    // Delete comment
    const deleteMutation = useMutation({
        mutationFn: async (commentId: string) => {
            await apiClient.delete(`/api/comments/${commentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["comments", gridItemId] });
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        createMutation.mutate(newComment.trim());
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="mt-16 w-full max-w-4xl mx-auto border-4 border-black dark:border-gray-700 bg-brutal-white brutal-shadow p-6 md:p-8">
            <h3 className="font-heading font-black text-3xl uppercase mb-8 border-b-4 border-black dark:border-gray-700 pb-4">
                Discussion
                <span className="text-brutal-purple">.</span>
            </h3>

            {/* Comment List */}
            <div className="flex flex-col gap-6 mb-8">
                {isLoading ? (
                    <div className="font-mono text-gray-500 font-bold uppercase">Loading Comments...</div>
                ) : comments && comments.length > 0 ? (
                    comments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`p-4 border-4 border-black dark:border-gray-700 relative group transition-all text-brutal-black ${user?.email === comment.userName ? 'bg-brutal-yellow bg-opacity-20' : 'bg-brutal-bg'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-heading font-bold text-lg">
                                    {comment.userName.split('@')[0]}
                                    {isAdminModeEnbaled && (comment.userName === 'admin@chportfolio.dev' || comment.userName === 'ych0911y@gmail.com') && (
                                        <span className="ml-2 text-xs bg-black text-white px-2 py-1 uppercase">Admin</span>
                                    )}
                                </div>
                                <div className="font-mono text-xs text-gray-500 bg-brutal-white border-2 border-black dark:border-gray-700 px-2 py-1">
                                    {formatDate(comment.createdAt)}
                                </div>
                            </div>
                            <p className="font-mono whitespace-pre-wrap text-brutal-black">{comment.content}</p>

                            {/* Delete Button (Visible if user owns it or is admin) */}
                            {(user?.email === comment.userName || isAdminModeEnbaled) && (
                                <button
                                    onClick={() => {
                                        if (window.confirm("Delete this comment?")) {
                                            deleteMutation.mutate(comment.id);
                                        }
                                    }}
                                    disabled={deleteMutation.isPending}
                                    className={`absolute -top-3 -right-3 bg-brutal-red text-white p-2 border-2 border-black dark:border-gray-700 transition-all hover:scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 ${isAdminModeEnbaled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                    title="Delete Comment"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="font-mono text-gray-400 italic font-bold">No comments yet. Be the first to start the discussion!</div>
                )}
            </div>

            {/* Post Comment Input */}
            <div className="border-t-4 border-black dark:border-gray-700 pt-8">
                {isLoggedIn ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write your comment here..."
                            className="w-full min-h-[120px] p-4 font-mono border-4 border-black dark:border-gray-700 bg-brutal-white text-brutal-black outline-none focus:bg-brutal-cyan/10 transition-colors resize-y"
                            disabled={createMutation.isPending}
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || createMutation.isPending}
                            className="self-end bg-black text-white px-8 py-3 font-heading font-black uppercase flex items-center gap-2 border-4 border-black dark:border-gray-700 hover:bg-brutal-cyan hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                            {createMutation.isPending ? "Posting..." : (
                                <>
                                    <Send className="w-5 h-5" /> Post Comment
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="bg-brutal-white p-6 border-4 border-black dark:border-gray-700 text-center text-brutal-black">
                        <p className="font-heading font-black text-xl mb-4">You must be logged in to comment.</p>
                        <a
                            href="/login"
                            className="inline-block bg-brutal-purple text-white px-6 py-2 font-heading font-black uppercase border-4 border-black dark:border-gray-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                        >
                            Log In / Register
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
