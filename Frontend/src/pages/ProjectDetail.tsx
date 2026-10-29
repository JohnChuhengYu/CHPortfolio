import { useState, useTransition } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Upload, X, Github } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { CommentSection } from "@/components/comments/CommentSection";
import { BrutalBadge, type BrutalBadgeProps } from "@/components/ui/BrutalBadge";
import { GodModeActionBar } from "@/components/GodModeActionBar";

export function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAdminModeEnbaled } = useAuth();
    const queryClient = useQueryClient();
    const [, startTransition] = useTransition();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // 1. Fetch Data
    const { data: project, isLoading } = useQuery({
        queryKey: ["projectDetail", id],
        queryFn: async () => {
            const res = await apiClient.get(`/api/grid-items/${id}`);
            return res.data;
        }
    });

    // 2. Local Edit State for Admins (Real-time Markdown editing)
    const [editData, setEditData] = useState<any>(null);
    const [tagsInput, setTagsInput] = useState<string | null>(null);

    const handleEdit = (field: string, value: string | string[]) => {
        setEditData((prev: any) => ({
            ...(prev || project),
            [field]: value
        }));
    };

    // 3. Save Changes
    const updateMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            await apiClient.put(`/api/grid-items/${id}`, updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projectDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setEditData(null);
            setTagsInput(null);
        }
    });

    // 4. Cover Image Upload
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

    // 5. Gallery Image Upload (Multiple)
    const uploadGalleryMutation = useMutation({
        mutationFn: async (files: FileList) => {
            const formData = new FormData();
            Array.from(files).forEach((file) => {
                formData.append("files", file);
            });
            const res = await apiClient.post("/api/Upload/multiple", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            return res.data.urls as string[];
        },
        onSuccess: (urls) => {
            const currentGallery = editData?.galleryImages || project?.galleryImages || [];
            const newFullUrls = urls.map(url => `http://localhost:5298${url}`);
            handleEdit("galleryImages", [...currentGallery, ...newFullUrls]);
        }
    });

    // Helper for removing gallery image
    const handleRemoveGalleryImage = (indexToRemove: number) => {
        const currentGallery = editData?.galleryImages || project?.galleryImages || [];
        const newGallery = currentGallery.filter((_: any, idx: number) => idx !== indexToRemove);
        handleEdit("galleryImages", newGallery);
    };

    const handleBack = () => {
        startTransition(() => {
            navigate(-1);
        });
    };

    if (isLoading) return <div className="p-8 text-2xl font-black font-heading text-brutal-black">LOADING CONTENT...</div>;
    if (!project) return <div className="p-8 text-2xl font-black font-heading text-brutal-black">404 NOT FOUND.</div>;

    const displayData = editData || project;

    return (
        <div className="min-h-screen bg-brutal-bg text-brutal-black p-6 md:p-12 relative pb-32">
            {/* Back Button */}
            <button
                onClick={handleBack}
                className="mb-10 bg-brutal-yellow text-black border-2 border-brutal-border px-5 py-2.5 font-heading font-black text-sm uppercase shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#333] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2 cursor-pointer"
            >
                <ArrowLeft className="w-4 h-4" /> Back to Grid
            </button>

            {/* Header Section */}
            <header className="mb-12">
                {isAdminModeEnbaled ? (
                    <div className="flex flex-col gap-4 p-6 bg-brutal-white border-2 border-brutal-border shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] mb-6">
                        <div className="flex items-center gap-2 text-xs font-heading font-black text-brutal-pink uppercase">
                            <span className="w-2 h-2 rounded-full bg-brutal-pink inline-block animate-pulse"></span>
                            Editing Project Header
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-heading font-bold text-xs uppercase text-brutal-muted">Project Title</label>
                            <input
                                value={displayData.title || ''}
                                onChange={(e) => handleEdit('title', e.target.value)}
                                className="w-full font-heading font-black text-3xl sm:text-5xl md:text-6xl uppercase border-2 border-brutal-border p-3.5 bg-brutal-bg text-brutal-black focus:outline-none focus:ring-2 focus:ring-brutal-yellow transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                                placeholder="PROJECT TITLE"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="font-heading font-bold text-xs uppercase text-brutal-muted">Subtitle / Summary</label>
                            <textarea
                                value={displayData.subTitle || ''}
                                onChange={(e) => handleEdit('subTitle', e.target.value)}
                                className="w-full font-heading font-bold text-base md:text-xl border-2 border-brutal-border p-3.5 bg-brutal-bg text-brutal-black focus:outline-none focus:ring-2 focus:ring-brutal-yellow resize-y min-h-[90px] transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                                placeholder="PROJECT DESCRIPTION / SUMMARY"
                                rows={3}
                            />
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="font-heading font-black text-5xl md:text-7xl md:leading-tight uppercase break-words text-brutal-black">
                            {displayData.title}
                        </h1>
                        {displayData.subTitle && (
                            <h2 className="font-heading font-bold text-xl md:text-2xl mt-4 text-brutal-muted leading-relaxed">
                                {displayData.subTitle}
                            </h2>
                        )}
                    </>
                )}

                {/* GitHub URL Section */}
                {(displayData.githubUrl || isAdminModeEnbaled) && (
                    <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="bg-black text-white p-2.5 border-2 border-brutal-border inline-flex items-center justify-center self-start sm:self-auto shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]">
                            <Github className="w-5 h-5" />
                        </div>
                        {isAdminModeEnbaled ? (
                            <input
                                value={displayData.githubUrl || ''}
                                onChange={(e) => handleEdit('githubUrl', e.target.value)}
                                className="flex-1 font-mono font-bold text-sm border-2 border-brutal-border p-2.5 bg-brutal-white text-brutal-black focus:outline-none focus:ring-2 focus:ring-brutal-yellow transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]"
                                placeholder="https://github.com/username/repository"
                            />
                        ) : (
                            <a
                                href={displayData.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono font-bold text-base hover:text-brutal-pink hover:underline underline-offset-4 transition-colors break-all"
                            >
                                {displayData.githubUrl}
                            </a>
                        )}
                    </div>
                )}

                {/* Tags Section */}
                <div className="mt-6">
                    {isAdminModeEnbaled ? (
                        <div className="flex flex-col gap-1.5 p-4 bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]">
                            <label className="font-heading font-bold text-xs uppercase text-brutal-muted">
                                Tags (separated by comma)
                            </label>
                            <input
                                value={tagsInput !== null ? tagsInput : (displayData.tags || []).join(", ")}
                                onChange={(e) => {
                                    setTagsInput(e.target.value);
                                    const newTags = e.target.value.split(",").map(t => t.trim()).filter(Boolean);
                                    handleEdit('tags', newTags);
                                }}
                                className="w-full font-mono font-bold text-sm border-2 border-brutal-border p-2.5 bg-brutal-bg text-brutal-black focus:outline-none focus:ring-2 focus:ring-brutal-yellow transition-all"
                                placeholder="React 19, .NET 10, PostgreSQL, Docker"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2.5 items-center">
                            {displayData.tags?.map((tag: string, index: number) => {
                                const colors: BrutalBadgeProps['color'][] = ['yellow', 'cyan', 'pink', 'lime', 'purple', 'sky', 'rose'];
                                const badgeColor = colors[index % colors.length];
                                return (
                                    <BrutalBadge key={tag} color={badgeColor} className="text-sm">
                                        {tag}
                                    </BrutalBadge>
                                );
                            })}
                        </div>
                    )}
                </div>
            </header>

            {/* Image Preview & Cover Area */}
            {(displayData.imageUrl || isAdminModeEnbaled) && (
                <div className="mb-12 border-2 border-brutal-border shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#333] overflow-hidden bg-brutal-white min-h-[220px] flex flex-col items-center justify-center relative">
                    {displayData.imageUrl ? (
                        <img src={displayData.imageUrl} alt="Cover" className="w-full h-auto object-cover max-h-[60vh]" />
                    ) : (
                        <div className="py-16 flex flex-col items-center gap-2 text-brutal-muted">
                            <span className="font-heading font-black text-2xl uppercase">NO COVER IMAGE</span>
                            <span className="font-mono text-xs">Upload an image below or paste a direct URL</span>
                        </div>
                    )}

                    {isAdminModeEnbaled && (
                        <div className="w-full bg-brutal-white dark:bg-brutal-bg border-t-2 border-brutal-border p-3.5 flex flex-col sm:flex-row items-center gap-3">
                            <div className="flex-1 w-full flex items-center gap-2">
                                <span className="font-mono text-xs font-bold uppercase text-brutal-muted whitespace-nowrap hidden md:inline">Cover URL:</span>
                                <input
                                    value={displayData.imageUrl || ''}
                                    onChange={(e) => handleEdit('imageUrl', e.target.value)}
                                    className="flex-1 font-mono text-xs sm:text-sm border-2 border-brutal-border p-2 bg-brutal-white text-brutal-black outline-none focus:ring-2 focus:ring-brutal-yellow"
                                    placeholder="https://... or /uploads/..."
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="cover-upload"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) uploadMutation.mutate(file);
                                    }}
                                />
                                <label
                                    htmlFor="cover-upload"
                                    className="w-full sm:w-auto bg-brutal-cyan text-black px-4 py-2 border-2 border-brutal-border font-heading font-bold text-xs uppercase cursor-pointer hover:bg-brutal-yellow transition-colors text-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 inline-flex items-center justify-center gap-2"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploadMutation.isPending ? "Uploading..." : "Upload Cover"}
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Two-Column Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                {/* The Challenge */}
                <div className="bg-brutal-white text-brutal-black border-2 border-brutal-border p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] relative">
                    <div className="absolute -top-4 -left-3 bg-brutal-yellow text-black px-3.5 py-1 font-heading font-black text-sm md:text-base uppercase border-2 border-brutal-border shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] transform -rotate-2 z-10">
                        THE CHALLENGE
                    </div>
                    {isAdminModeEnbaled ? (
                        <div className="mt-4 flex flex-col gap-2">
                            <span className="text-xs font-mono text-brutal-muted">Markdown enabled</span>
                            <textarea
                                value={displayData.problemDescription || ''}
                                onChange={(e) => handleEdit('problemDescription', e.target.value)}
                                className="w-full h-[360px] bg-brutal-bg border-2 border-brutal-border p-4 outline-none resize-y font-mono text-sm sm:text-base text-brutal-black focus:ring-2 focus:ring-brutal-yellow transition-colors leading-relaxed"
                                placeholder="Document the technical hurdles, latency issues, architectural bottlenecks..."
                            />
                        </div>
                    ) : (
                        <div className="mt-6 brutal-prose max-w-none font-mono text-brutal-black">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {displayData.problemDescription || '*No challenge description provided.*'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* The Solution */}
                <div className="bg-brutal-white text-brutal-black border-2 border-brutal-border p-6 md:p-8 shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] relative">
                    <div className="absolute -top-4 -left-3 bg-brutal-cyan text-black px-3.5 py-1 font-heading font-black text-sm md:text-base uppercase border-2 border-brutal-border shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] transform rotate-2 z-10">
                        THE SOLUTION
                    </div>
                    {isAdminModeEnbaled ? (
                        <div className="mt-4 flex flex-col gap-2">
                            <span className="text-xs font-mono text-brutal-muted">Markdown enabled</span>
                            <textarea
                                value={displayData.solutionDescription || ''}
                                onChange={(e) => handleEdit('solutionDescription', e.target.value)}
                                className="w-full h-[360px] bg-brutal-bg border-2 border-brutal-border p-4 outline-none resize-y font-mono text-sm sm:text-base text-brutal-black focus:ring-2 focus:ring-brutal-yellow transition-colors leading-relaxed"
                                placeholder="Document how you resolved the challenge, patterns used, architecture..."
                            />
                        </div>
                    ) : (
                        <div className="mt-6 brutal-prose max-w-none font-mono text-brutal-black">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {displayData.solutionDescription || '*No solution description provided.*'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Gallery Area */}
            {((displayData.galleryImages && displayData.galleryImages.length > 0) || isAdminModeEnbaled) && (
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase text-brutal-black">
                            Photo Gallery
                            <span className="text-brutal-pink">.</span>
                        </h2>

                        {isAdminModeEnbaled && (
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    id="gallery-upload"
                                    className="hidden"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            uploadGalleryMutation.mutate(files);
                                        }
                                    }}
                                />
                                <label
                                    htmlFor="gallery-upload"
                                    className="bg-brutal-yellow text-black px-4 py-2 border-2 border-brutal-border font-heading font-bold text-xs uppercase cursor-pointer hover:bg-black hover:text-white transition-colors text-center shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 inline-flex items-center gap-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    {uploadGalleryMutation.isPending ? "Uploading..." : "Add Photos"}
                                </label>
                            </div>
                        )}
                    </div>

                    {displayData.galleryImages && displayData.galleryImages.length > 0 ? (
                        isAdminModeEnbaled ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayData.galleryImages.map((imgUrl: string, idx: number) => (
                                    <div key={idx} className="relative group border-2 border-brutal-border shadow-[3px_3px_0px_0px_#000] dark:shadow-[3px_3px_0px_0px_#333] bg-brutal-white p-2">
                                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-auto aspect-video object-cover border border-brutal-border" />
                                        <button
                                            onClick={() => handleRemoveGalleryImage(idx)}
                                            className="absolute top-3 right-3 bg-brutal-red text-white p-1.5 border-2 border-brutal-border hover:scale-105 transition-transform shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] z-10 cursor-pointer"
                                            title="Remove Image"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative w-full overflow-hidden flex pb-8 px-2 group/gallery brutal-scrollbar">
                                <div className="flex gap-6 w-max transition-all animate-[marquee_30s_linear_infinite] group-hover/gallery:![animation-play-state:paused]">
                                    {[...displayData.galleryImages, ...displayData.galleryImages].map((imgUrl: string, idx: number) => {
                                        const originalIdx = idx % displayData.galleryImages.length;

                                        return (
                                            <div key={idx} className="relative group/card border-2 border-brutal-border shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] bg-brutal-white p-2 flex-none w-[80vw] md:w-[600px] h-[300px] md:h-[400px]">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Gallery ${originalIdx + 1}`}
                                                    className="w-full h-full object-cover border border-brutal-border cursor-pointer"
                                                    onClick={() => setSelectedImage(imgUrl)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="p-8 border-2 border-brutal-border border-dashed text-center font-heading font-bold text-lg text-brutal-muted">
                            NO PHOTOS IN GALLERY YET.
                        </div>
                    )}
                </div>
            )}

            {/* Click to Zoom Modal overlay */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <button className="absolute top-6 right-6 bg-brutal-white text-brutal-black p-2 border-2 border-brutal-border hover:bg-brutal-yellow brutal-shadow">
                        <X className="w-6 h-6" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoomed"
                        className="max-w-full max-h-[90vh] object-contain border-2 border-white pointer-events-none"
                    />
                </div>
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
                    onDiscard={() => {
                        setEditData(null);
                        setTagsInput(null);
                    }}
                    title="Editing Project"
                />
            )}
        </div>
    );
}

