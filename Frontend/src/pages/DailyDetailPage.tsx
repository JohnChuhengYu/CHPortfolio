import { useState } from "react";
import { useParams, Link } from "react-router";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ArrowLeft, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CommentSection } from "@/components/comments/CommentSection";
import { GodModeActionBar } from "@/components/GodModeActionBar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";

export function DailyDetailPage() {
    const { id } = useParams();
    const { isAdminModeEnbaled } = useAuth();
    const queryClient = useQueryClient();
    const [editData, setEditData] = useState<any>(null);

    const { data: post, isLoading, isError } = useQuery({
        queryKey: ["dailyDetail", id],
        queryFn: async () => {
            const res = await apiClient.get(`/api/grid-items/${id}`);
            return res.data;
        },
        enabled: !!id
    });

    const handleEdit = (field: string, value: string) => {
        setEditData((prev: any) => ({
            ...(prev || post),
            [field]: value
        }));
    };

    const updateMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            await apiClient.put(`/api/grid-items/${id}`, updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dailyDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setEditData(null);
        }
    });

    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            const res = await apiClient.post("/api/Upload", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data.url;
        },
        onSuccess: (url) => {
            const fullUrl = `http://localhost:5298${url}`;
            handleEdit("imageUrl", fullUrl);
        }
    });

    if (isLoading) return <div className="p-8 text-2xl font-black font-heading text-brutal-black">LOADING POST...</div>;
    if (isError || !post) {
        return (
            <div className="max-w-3xl w-full mx-auto px-6 py-16 text-center text-brutal-black">
                <h1 className="font-heading text-4xl mb-6">Post Not Found</h1>
                <Link to="/daily">
                    <BrutalButton>Go Back</BrutalButton>
                </Link>
            </div>
        );
    }

    const displayData = editData || post;

    return (
        <div className="max-w-3xl w-full mx-auto px-6 py-16 text-brutal-black relative pb-32">
            {/* Back Navigation */}
            <Link to="/daily" className="inline-block mb-10">
                <BrutalButton variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Timeline
                </BrutalButton>
            </Link>

            <BrutalCard color="white" className="flex flex-col gap-6 animate-slide-up p-6 md:p-10 border-2 border-brutal-border shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#333]">
                {/* 1. Title */}
                {isAdminModeEnbaled ? (
                    <div className="flex flex-col gap-1.5 p-4 bg-brutal-bg border-2 border-brutal-border shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]">
                        <div className="flex items-center justify-between">
                            <label className="font-heading font-bold text-xs uppercase text-brutal-muted">Title</label>
                            <span className="text-xs font-heading font-black text-brutal-pink uppercase">Live Editing</span>
                        </div>
                        <input
                            value={displayData.title || ''}
                            onChange={(e) => handleEdit('title', e.target.value)}
                            className="w-full font-heading font-black text-2xl sm:text-4xl uppercase border-2 border-brutal-border p-3 bg-brutal-white text-brutal-black outline-none focus:ring-2 focus:ring-brutal-yellow transition-all"
                            placeholder="TITLE"
                        />
                    </div>
                ) : (
                    <h1 className="font-heading font-black text-3xl sm:text-5xl uppercase break-words border-b-2 border-brutal-border pb-4 text-brutal-black">
                        {displayData.title}
                    </h1>
                )}

                {/* 2. Date */}
                <div className="flex items-center gap-3">
                    <BrutalBadge color="yellow" className="text-xs px-3 py-1">
                        {new Date(displayData.createdAt).toLocaleDateString()}
                    </BrutalBadge>
                </div>

                {/* 3. Content */}
                {isAdminModeEnbaled ? (
                    <div className="flex flex-col gap-1.5">
                        <label className="font-heading font-bold text-xs uppercase text-brutal-muted">Post Content</label>
                        <textarea
                            value={displayData.content || ''}
                            onChange={(e) => handleEdit('content', e.target.value)}
                            className="w-full h-[260px] bg-brutal-bg border-2 border-brutal-border p-4 outline-none resize-y font-mono text-base text-brutal-black focus:ring-2 focus:ring-brutal-yellow transition-colors leading-relaxed shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                            placeholder="Write content here..."
                        />
                    </div>
                ) : (
                    <div className="font-heading text-lg md:text-xl leading-relaxed whitespace-pre-wrap py-2 text-brutal-black">
                        {displayData.content}
                    </div>
                )}

                {/* 4. Moods / Subtitle */}
                <div className="mt-4 flex flex-col gap-3">
                    <span className="font-mono text-xs font-bold uppercase text-brutal-muted tracking-widest border-b-2 border-dashed border-brutal-border pb-1 w-fit">
                        CURRENT MOODS
                    </span>
                    {isAdminModeEnbaled ? (
                        <div className="flex flex-col gap-1">
                            <input
                                value={displayData.subTitle || ''}
                                onChange={(e) => handleEdit('subTitle', e.target.value)}
                                className="w-full font-mono font-bold text-sm border-2 border-brutal-border p-2.5 bg-brutal-bg text-brutal-black outline-none focus:ring-2 focus:ring-brutal-yellow"
                                placeholder="Moods (comma separated, e.g. Focused, Coding, Coffee ☕)"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2.5">
                            {(displayData.subTitle || "✨").split(",").map((m: string, i: number) => (
                                <BrutalBadge
                                    key={i}
                                    color={["cyan", "pink", "yellow", "blue", "green", "orange", "purple"][i % 7] as any}
                                    className="px-4 py-1.5 text-xs"
                                >
                                    {m.trim()}
                                </BrutalBadge>
                            ))}
                        </div>
                    )}
                </div>

                {/* 5. Optional Image */}
                {(displayData.imageUrl || isAdminModeEnbaled) && (
                    <div className="mt-4 border-2 border-brutal-border overflow-hidden relative bg-brutal-bg min-h-[180px] flex flex-col items-center justify-center">
                        {displayData.imageUrl ? (
                            <img
                                src={displayData.imageUrl}
                                alt="Post attachment"
                                className="w-full h-auto object-cover max-h-[50vh]"
                            />
                        ) : (
                            <div className="py-12 flex flex-col items-center gap-1 text-brutal-muted">
                                <span className="font-heading font-black text-xl uppercase">NO IMAGE</span>
                                <span className="font-mono text-xs">Add an image below</span>
                            </div>
                        )}

                        {isAdminModeEnbaled && (
                            <div className="w-full bg-brutal-white dark:bg-brutal-bg border-t-2 border-brutal-border p-3 flex flex-col sm:flex-row items-center gap-2">
                                <input
                                    value={displayData.imageUrl || ''}
                                    onChange={(e) => handleEdit('imageUrl', e.target.value)}
                                    className="flex-1 w-full font-mono text-xs border-2 border-brutal-border p-2 bg-brutal-white text-brutal-black outline-none focus:ring-2 focus:ring-brutal-yellow"
                                    placeholder="Image URL..."
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="daily-image-upload"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) uploadMutation.mutate(file);
                                        }}
                                    />
                                    <label
                                        htmlFor="daily-image-upload"
                                        className="w-full sm:w-auto bg-brutal-cyan text-black px-3 py-1.5 border-2 border-brutal-border font-heading font-bold text-xs uppercase cursor-pointer hover:bg-brutal-yellow text-center inline-flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Upload className="w-3.5 h-3.5" />
                                        {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </BrutalCard>

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
                    title="Editing Daily Post"
                />
            )}
        </div>
    );
}

