import { useState } from "react";
import { useParams, Link } from "react-router";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { CommentSection } from "@/components/comments/CommentSection";

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

    if (isLoading) return <div className="p-8 text-2xl font-black font-heading">LOADING POST...</div>;
    if (isError || !post) {
        return (
            <div className="max-w-3xl w-full mx-auto px-6 py-16 text-center">
                <h1 className="font-heading text-4xl mb-6">Post Not Found</h1>
                <Link to="/daily">
                    <BrutalButton>Go Back</BrutalButton>
                </Link>
            </div>
        );
    }

    const displayData = editData || post;

    return (
        <div className="max-w-3xl w-full mx-auto px-6 py-16">
            {/* Back Navigation */}
            <Link to="/daily" className="inline-block mb-10">
                <BrutalButton variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back to Timeline
                </BrutalButton>
            </Link>

            <BrutalCard color="white" className="flex flex-col gap-6 animate-slide-up p-8 md:p-12">
                {/* 1. Title */}
                {isAdminModeEnbaled ? (
                    <input
                        value={displayData.title || ''}
                        onChange={(e) => handleEdit('title', e.target.value)}
                        className="w-full font-heading font-black text-4xl md:text-6xl uppercase border-4 border-black dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800 outline-none focus:bg-brutal-yellow mb-6"
                        placeholder="TITLE"
                    />
                ) : (
                    <h1 className="font-heading font-black text-4xl md:text-6xl uppercase break-words border-b-4 border-black dark:border-gray-700 pb-6">
                        {displayData.title}
                    </h1>
                )}

                {/* 2. Date */}
                <div className="flex items-center gap-3">
                    <BrutalBadge color="yellow" className="text-sm px-3 py-1">
                        {new Date(displayData.createdAt).toLocaleDateString()}
                    </BrutalBadge>
                </div>

                {/* 3. Content */}
                {isAdminModeEnbaled ? (
                    <textarea
                        value={displayData.content || ''}
                        onChange={(e) => handleEdit('content', e.target.value)}
                        className="w-full h-[300px] mt-6 bg-brutal-white border-4 border-black dark:border-gray-700 p-4 outline-none resize-y font-mono text-lg text-brutal-black focus:bg-brutal-cyan/10 transition-colors"
                        placeholder="CONTENT..."
                    />
                ) : (
                    <div className="font-heading text-xl md:text-2xl leading-relaxed whitespace-pre-wrap py-2">
                        {displayData.content}
                    </div>
                )}

                <div className="mt-8 flex flex-col gap-4">
                    <span className="font-mono text-sm font-bold uppercase text-gray-400 tracking-widest border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-2 w-fit">CURRENT MOODS</span>
                    {isAdminModeEnbaled ? (
                        <input
                            value={displayData.subTitle || ''}
                            onChange={(e) => handleEdit('subTitle', e.target.value)}
                            className="w-full font-mono font-bold text-sm border-4 border-black dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800 outline-none"
                            placeholder="MOODS (COMMA SEPARATED)"
                        />
                    ) : (
                        <div className="flex flex-wrap gap-3">
                            {(displayData.subTitle || "✨").split(",").map((m: string, i: number) => (
                                <BrutalBadge
                                    key={i}
                                    color={["cyan", "pink", "yellow", "blue", "green", "orange", "purple"][i % 7] as any}
                                    className="px-5 py-2.5 text-sm"
                                >
                                    {m.trim()}
                                </BrutalBadge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Optional Image */}
                {(displayData.imageUrl || isAdminModeEnbaled) && (
                    <div className="mt-6 border-3 border-black dark:border-gray-700 overflow-hidden brutal-shadow-sm relative group bg-gray-100 dark:bg-gray-800 min-h-[200px] flex items-center justify-center">
                        {displayData.imageUrl ? (
                            <img
                                src={displayData.imageUrl}
                                alt="Post attachment"
                                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <span className="font-heading font-black text-2xl text-gray-400">NO IMAGE</span>
                        )}

                        {isAdminModeEnbaled && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                                <div className="flex flex-col gap-4 w-full max-w-lg">
                                    <input
                                        value={displayData.imageUrl || ''}
                                        onChange={(e) => handleEdit('imageUrl', e.target.value)}
                                        className="w-full font-mono text-sm border-4 border-black dark:border-gray-700 p-3 bg-brutal-white outline-none"
                                        placeholder="IMAGE URL..."
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                    <div className="flex items-center justify-center gap-4">
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
                                            className="bg-brutal-cyan text-black px-4 py-2 border-4 border-black dark:border-gray-700 font-heading font-black cursor-pointer hover:bg-brutal-yellow text-center inline-flex items-center gap-2"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Upload className="w-5 h-5" />
                                            {uploadMutation.isPending ? "UPLOADING..." : "UPLOAD NEW"}
                                        </label>
                                    </div>
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
