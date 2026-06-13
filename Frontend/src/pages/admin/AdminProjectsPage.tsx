import { useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalInput } from "@/components/ui/BrutalInput";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalConfirmModal } from "@/components/ui/BrutalConfirmModal";
import { X } from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/apiClient";
import { gridItemsApi } from "@/api/gridItems";

type FormState = {
    error: string | null;
    success: boolean;
    message: string | null;
};

// ... SubmitButton remains same ...

// Submit button that uses useFormStatus for pending state
function SubmitButton({ label }: { label: string }) {
    const { pending } = useFormStatus();
    return (
        <BrutalButton type="submit" variant="primary" disabled={pending} className="w-full">
            {pending ? "Saving..." : label}
        </BrutalButton>
    );
}

export function AdminProjectsPage() {
    const queryClient = useQueryClient();
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    // Fetch existing projects
    const { data: existingProjects = [], isLoading } = useQuery({
        queryKey: ["admin-projects"],
        queryFn: async () => {
            const res = await apiClient.get("/api/grid-items?type=Project");
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => gridItemsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setProjectToDelete(null);
        },
        onError: (err: any) => {
            alert("Failed to delete project: " + err.message);
            setProjectToDelete(null);
        }
    });

    const triggerDelete = (id: string) => {
        setProjectToDelete(id);
    };

    const confirmDelete = () => {
        if (projectToDelete) {
            deleteMutation.mutate(projectToDelete);
        }
    };

    const [state, formAction] = useActionState(
        async (_prevState: FormState, formData: FormData): Promise<FormState> => {
            const title = formData.get("title") as string;
            const description = formData.get("description") as string;
            // Note: GitHub URL not currently stored on backend
            void formData.get("githubUrl");
            const rawTags = formData.get("tags") as string;

            if (!title || !description) {
                return { error: "Title and description are required.", success: false, message: null };
            }

            try {
                const tags = rawTags ? rawTags.split(",").map(t => t.trim()).filter(Boolean) : [];

                await apiClient.post("/api/grid-items", {
                    type: "Project",
                    title,
                    subTitle: description, // Used subTitle instead of content for brief
                    content: description,
                    tags: tags,
                    imageUrl: "https://placehold.co/600x400/ffde59/000?text=New+Project",
                    color: "yellow",
                    gridSpanX: 1,
                    gridSpanY: 1
                });

                queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
                queryClient.invalidateQueries({ queryKey: ["grid-items"] });

                return { error: null, success: true, message: `Project "${title}" created successfully!` };
            } catch (err: any) {
                return { error: err.message || "Failed to create project", success: false, message: null };
            }
        },
        { error: null, success: false, message: null }
    );

    return (
        <div className="max-w-4xl">
            <h1 className="font-heading text-3xl font-bold mb-8">
                Manage Projects
                <span className="text-brutal-purple">.</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <BrutalCard color="white" className="lg:col-span-2">
                    <h2 className="font-heading text-xl font-bold mb-6">Create / Edit Project</h2>
                    <form action={formAction} className="flex flex-col gap-5">
                        <BrutalInput name="title" label="Project Title" placeholder="My Awesome Project" required />
                        <div className="flex flex-col gap-2">
                            <label className="font-heading font-bold text-sm">Description</label>
                            <textarea
                                name="description"
                                placeholder="What does this project do?"
                                required
                                rows={5}
                                className="font-heading px-4 py-3 text-lg border-3 border-brutal-border bg-brutal-white text-brutal-black
                                           brutal-shadow-sm placeholder:text-brutal-muted
                                           focus:outline-none focus:shadow-[6px_6px_0px_0px_var(--theme-border)]
                                           transition-shadow duration-150 resize-y min-h-[120px]"
                            />
                        </div>
                        <BrutalInput name="githubUrl" label="GitHub URL" placeholder="https://github.com/..." />
                        <BrutalInput name="tags" label="Tags (comma-separated)" placeholder="React, TypeScript, .NET" />

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

                        <SubmitButton label="Save Project" />
                    </form>
                </BrutalCard>

                {/* Existing Projects */}
                <BrutalCard color="yellow">
                    <h2 className="font-heading text-lg font-bold mb-4">Existing Projects</h2>
                    <ul className="flex flex-col gap-3">
                        {isLoading ? (
                            <li className="p-3">Loading projects...</li>
                        ) : existingProjects.length === 0 ? (
                            <li className="p-3 text-gray-500">No projects created yet.</li>
                        ) : (
                            existingProjects.map((p: any) => (
                                <li key={p.id} className="relative bg-brutal-white border-2 border-brutal-border p-4 group">
                                    <div className="flex flex-col items-start gap-2 pr-8">
                                        <span className="font-heading font-semibold text-sm break-words dark:text-white">{p.title}</span>
                                        <BrutalBadge color="cyan" className="text-xs py-0.5">{p.type}</BrutalBadge>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => triggerDelete(p.id)}
                                        className="absolute top-2 right-2 bg-brutal-red text-white border-2 border-brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all p-1"
                                        title="Delete Project"
                                    >
                                        <X className="w-4 h-4" strokeWidth={3} />
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                </BrutalCard>
            </div>

            <BrutalConfirmModal
                isOpen={!!projectToDelete}
                title="Delete Project?"
                message="Are you sure you want to delete this project? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setProjectToDelete(null)}
            />
        </div>
    );
}
