import { useState, useTransition } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, Upload, X, Github } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { CommentSection } from "@/components/comments/CommentSection";
import { BrutalBadge, type BrutalBadgeProps } from "@/components/ui/BrutalBadge";

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

    const handleEdit = (field: string, value: string | string[]) => {
        setEditData((prev: any) => ({
            ...(prev || project),
            [field]: value
        }));
    };

    // Helper for tags editing (comma separated)
    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newTags = val.split(",").map(t => t.trim()).filter(Boolean);
        handleEdit('tags', newTags);
    };

    // 3. Save Changes
    const updateMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            await apiClient.put(`/api/grid-items/${id}`, updatedData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projectDetail", id] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setEditData(null); // Exit edit mode
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
                formData.append("files", file); // Must match 'List<IFormFile> files' in .NET
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

    if (isLoading) return <div className="p-8 text-4xl font-black font-heading">LOADING CONTENT...</div>;
    if (!project) return <div className="p-8 text-4xl font-black font-heading">404 NOT FOUND.</div>;

    const displayData = editData || project;

    return (
        <div className="min-h-screen bg-brutal-bg p-6 md:p-12 relative pb-32">
            {/* Giant Back Button */}
            <button
                onClick={handleBack}
                className="mb-12 bg-brutal-yellow text-black border-4 border-black dark:border-gray-700 px-6 py-4 font-heading font-black text-2xl uppercase brutal-shadow hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-4 cursor-pointer"
            >
                <ArrowLeft className="w-8 h-8" /> BACK TO GRID
            </button>

            {/* Header Section */}
            <header className="mb-16">
                {isAdminModeEnbaled ? (
                    <div className="flex flex-col gap-4">
                        <input
                            value={displayData.title || ''}
                            onChange={(e) => handleEdit('title', e.target.value)}
                            className="w-full font-heading font-black text-6xl md:text-8xl md:leading-none uppercase border-4 border-black dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800 outline-none focus:bg-brutal-purple focus:text-white"
                            placeholder="TITLE"
                        />
                        <textarea
                            value={displayData.subTitle || ''}
                            onChange={(e) => handleEdit('subTitle', e.target.value)}
                            className="w-full font-heading font-bold text-2xl md:text-3xl border-4 border-black dark:border-gray-700 p-4 bg-gray-100 dark:bg-gray-800 outline-none focus:bg-brutal-yellow resize-y min-h-[120px]"
                            placeholder="DESCRIPTION"
                            rows={3}
                        />
                    </div>
                ) : (
                    <>
                        <h1 className="font-heading font-black text-6xl md:text-8xl md:leading-none uppercase break-words">
                            {displayData.title}
                        </h1>
                        {displayData.subTitle && (
                            <h2 className="font-heading font-bold text-2xl md:text-4xl mt-4 text-gray-700 dark:text-gray-400">
                                {displayData.subTitle}
                            </h2>
                        )}
                    </>
                )}

                {/* GitHub URL Section */}
                {(displayData.githubUrl || isAdminModeEnbaled) && (
                    <div className="mt-8 flex items-center gap-4">
                        <div className="bg-black text-white p-3 border-4 border-black dark:border-gray-700 inline-flex">
                            <Github className="w-6 h-6" />
                        </div>
                        {isAdminModeEnbaled ? (
                            <input
                                value={displayData.githubUrl || ''}
                                onChange={(e) => handleEdit('githubUrl', e.target.value)}
                                className="flex-1 font-mono font-bold text-sm border-4 border-black dark:border-gray-700 p-3 bg-brutal-white focus:bg-brutal-yellow transition-colors"
                                placeholder="GITHUB REPOSITORY URL..."
                            />
                        ) : (
                            <a
                                href={displayData.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono font-bold text-lg hover:text-brutal-pink hover:underline underline-offset-4 transition-colors break-all"
                            >
                                {displayData.githubUrl}
                            </a>
                        )}
                    </div>
                )}

                <div className="flex flex-wrap gap-4 mt-8 items-center">
                    {isAdminModeEnbaled ? (
                        <input
                            value={(displayData.tags || []).join(", ")}
                            onChange={handleTagsChange}
                            className="flex-1 font-mono font-bold text-sm border-4 border-black dark:border-gray-700 p-2 bg-gray-100 dark:bg-gray-800 outline-none"
                            placeholder="TAGS (COMMA SEPARATED)"
                        />
                    ) : (
                        displayData.tags?.map((tag: string, index: number) => {
                            const colors: BrutalBadgeProps['color'][] = ['yellow', 'cyan', 'pink', 'lime', 'purple', 'sky', 'rose'];
                            const badgeColor = colors[index % colors.length];

                            return (
                                <BrutalBadge key={tag} color={badgeColor} className="text-sm">
                                    {tag}
                                </BrutalBadge>
                            );
                        })
                    )}
                </div>
            </header>

            {/* Image Preview Area */}
            {(displayData.imageUrl || isAdminModeEnbaled) && (
                <div className="mb-16 border-8 border-black dark:border-gray-700 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2 transition-all overflow-hidden group relative bg-gray-100 dark:bg-gray-800 min-h-[200px] flex items-center justify-center">
                    {displayData.imageUrl ? (
                        <img src={displayData.imageUrl} alt="Cover" className="w-full h-auto object-cover max-h-[60vh]" />
                    ) : (
                        <span className="font-heading font-black text-4xl text-gray-300">NO IMAGE</span>
                    )}

                    {isAdminModeEnbaled && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                            <div className="flex flex-col gap-4 w-full max-w-2xl">
                                <input
                                    value={displayData.imageUrl || ''}
                                    onChange={(e) => handleEdit('imageUrl', e.target.value)}
                                    className="w-full font-mono text-lg border-4 border-black dark:border-gray-700 p-4 bg-brutal-white"
                                    placeholder="IMAGE URL..."
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex items-center gap-4">
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
                                        className="bg-brutal-cyan text-black px-6 py-4 border-4 border-black dark:border-gray-700 font-heading font-black cursor-pointer hover:bg-brutal-yellow transition-colors text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 inline-flex items-center gap-2"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Upload className="w-6 h-6" />
                                        {uploadMutation.isPending ? "UPLOADING..." : "UPLOAD NEW COVER"}
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Two-Column Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* The Challenge */}
                <div className="bg-brutal-yellow text-black border-4 border-black dark:border-gray-700 p-8 brutal-shadow relative">
                    <div className="absolute -top-6 -left-6 bg-black text-white px-4 py-2 font-heading font-black text-2xl uppercase transform -rotate-3 z-10">
                        THE CHALLENGE
                    </div>
                    {isAdminModeEnbaled ? (
                        <textarea
                            value={displayData.problemDescription || ''}
                            onChange={(e) => handleEdit('problemDescription', e.target.value)}
                            className="w-full h-[400px] mt-6 bg-brutal-white border-4 border-black dark:border-gray-700 p-4 outline-none resize-y font-mono text-lg text-black focus:bg-brutal-cyan/10 transition-colors"
                            placeholder="WRITE MARKDOWN HERE..."
                        />
                    ) : (
                        <div className="mt-6 prose prose-lg prose-brutal max-w-none font-mono">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {displayData.problemDescription || '*No challenge description provided.*'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                {/* The Solution */}
                <div className="bg-brutal-cyan text-black border-4 border-black dark:border-gray-700 p-8 brutal-shadow relative">
                    <div className="absolute -top-6 -left-6 bg-black text-white px-4 py-2 font-heading font-black text-2xl uppercase transform rotate-2 z-10">
                        THE SOLUTION
                    </div>
                    {isAdminModeEnbaled ? (
                        <textarea
                            value={displayData.solutionDescription || ''}
                            onChange={(e) => handleEdit('solutionDescription', e.target.value)}
                            className="w-full h-[400px] mt-6 bg-brutal-white border-4 border-black dark:border-gray-700 p-4 outline-none resize-y font-mono text-lg text-black focus:bg-brutal-cyan/10 transition-colors"
                            placeholder="WRITE MARKDOWN HERE..."
                        />
                    ) : (
                        <div className="mt-6 prose prose-lg prose-brutal max-w-none font-mono">
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                {displayData.solutionDescription || '*No solution description provided.*'}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* Photo Gallery Area */}
            {((displayData.galleryImages && displayData.galleryImages.length > 0) || isAdminModeEnbaled) && (
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-heading font-black text-4xl uppercase">
                            Photo Gallery
                            <span className="text-brutal-pink">.</span>
                        </h2>

                        {isAdminModeEnbaled && (
                            <div className="flex items-center gap-4">
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
                                    className="bg-brutal-yellow text-black px-6 py-3 border-4 border-black dark:border-gray-700 font-heading font-black uppercase cursor-pointer hover:bg-black hover:text-white transition-colors text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 inline-flex items-center gap-2"
                                >
                                    <Upload className="w-5 h-5" />
                                    {uploadGalleryMutation.isPending ? "ADDING..." : "ADD PHOTOS"}
                                </label>
                            </div>
                        )}
                    </div>

                    {displayData.galleryImages && displayData.galleryImages.length > 0 ? (
                        isAdminModeEnbaled ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {displayData.galleryImages.map((imgUrl: string, idx: number) => (
                                    <div key={idx} className="relative group border-4 border-black dark:border-gray-700 brutal-shadow bg-brutal-white p-2">
                                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-auto aspect-video object-cover border-2 border-black dark:border-gray-700" />
                                        <button
                                            onClick={() => handleRemoveGalleryImage(idx)}
                                            className="absolute -top-4 -right-4 bg-brutal-red text-white p-2 border-4 border-black dark:border-gray-700 hover:scale-110 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10"
                                            title="Remove Image"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="relative w-full overflow-hidden flex pb-8 px-2 group/gallery brutal-scrollbar">
                                <div className="flex gap-8 w-max transition-all animate-[marquee_30s_linear_infinite] group-hover/gallery:![animation-play-state:paused]">
                                    {[...displayData.galleryImages, ...displayData.galleryImages].map((imgUrl: string, idx: number) => {
                                        const originalIdx = idx % displayData.galleryImages.length;

                                        return (
                                            <div key={idx} className="relative group/card border-4 border-black dark:border-gray-700 brutal-shadow bg-brutal-white p-2 flex-none w-[80vw] md:w-[600px] h-[300px] md:h-[400px]">
                                                <img
                                                    src={imgUrl}
                                                    alt={`Gallery ${originalIdx + 1}`}
                                                    className="w-full h-full object-cover border-2 border-black dark:border-gray-700 cursor-pointer"
                                                    onClick={() => setSelectedImage(imgUrl)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="p-12 border-4 border-black dark:border-gray-700 border-dashed text-center font-heading font-bold text-2xl text-gray-400">
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
                    <button className="absolute top-6 right-6 bg-brutal-white text-brutal-black p-2 border-4 border-black dark:border-gray-700 hover:bg-brutal-yellow brutal-shadow">
                        <X className="w-8 h-8" />
                    </button>
                    <img
                        src={selectedImage}
                        alt="Zoomed"
                        className="max-w-full max-h-[90vh] object-contain border-4 border-white pointer-events-none"
                    />
                </div>
            )}

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
