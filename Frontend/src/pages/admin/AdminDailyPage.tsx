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

export function AdminDailyPage() {
    const queryClient = useQueryClient();
    const [dailyToDelete, setDailyToDelete] = useState<string | null>(null);

    // Fetch existing dailies
    const { data: existingDailies = [], isLoading } = useQuery({
        queryKey: ["admin-dailies"],
        queryFn: async () => {
            const res = await apiClient.get("/api/grid-items?type=Daily");
            return res.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => gridItemsApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-dailies"] });
            queryClient.invalidateQueries({ queryKey: ["grid-items"] });
            setDailyToDelete(null);
        },
        onError: (err: any) => {
            alert("Failed to delete daily post: " + err.message);
            setDailyToDelete(null);
        }
    });

    const triggerDelete = (id: string) => {
        setDailyToDelete(id);
    };

    const confirmDelete = () => {
        if (dailyToDelete) {
            deleteMutation.mutate(dailyToDelete);
        }
    };

    const [state, formAction] = useActionState(
        async (_prevState: FormState, formData: FormData): Promise<FormState> => {
            const title = formData.get("title") as string;
            const content = formData.get("content") as string;
            const mood = formData.get("mood") as string;

            if (!content) {
                return { error: "Content is required.", success: false, message: null };
            }

            try {
                await apiClient.post("/api/grid-items", {
                    type: "Daily",
                    title: title || "Daily Note",
                    subTitle: mood || "✨",
                    content,
                    color: "yellow",
                    gridSpanX: 1,
                    gridSpanY: 1
                });

                queryClient.invalidateQueries({ queryKey: ["admin-dailies"] });
                queryClient.invalidateQueries({ queryKey: ["grid-items"] });

                return { error: null, success: true, message: "Daily share posted successfully!" };
            } catch (err: any) {
                return { error: err.message || "Failed to post daily", success: false, message: null };
            }
        },
        { error: null, success: false, message: null }
    );

    return (
        <div className="max-w-4xl">
            <h1 className="font-heading text-3xl font-bold mb-8">
                Post Daily Share
                <span className="text-brutal-yellow">.</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <BrutalCard color="white" className="lg:col-span-2">
                    <form action={formAction} className="flex flex-col gap-5">
                        <BrutalInput name="title" label="Title" placeholder="Give your day a title..." required />
                        <div className="flex flex-col gap-2">
                            <label className="font-heading font-bold text-sm">Content</label>
                            <textarea
                                name="content"
                                placeholder="What's on your mind today?"
                                required
                                rows={5}
                                className="font-heading px-4 py-2.5 text-base border-3 border-brutal-border bg-brutal-white text-brutal-black
                                           brutal-shadow-sm placeholder:text-brutal-muted
                                           focus:outline-none focus:shadow-[6px_6px_0px_0px_var(--theme-border)]
                                           transition-shadow duration-150 resize-none"
                            />
                        </div>

                        <BrutalInput name="mood" label="Mood" placeholder="e.g. Happy, Excited, Tired" />

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

                        <SubmitButton label="Post It!" />
                    </form>
                </BrutalCard>

                {/* Existing Dailies */}
                <BrutalCard color="yellow">
                    <h2 className="font-heading text-lg font-bold mb-4">Existing Dailies</h2>
                    <ul className="flex flex-col gap-3">
                        {isLoading ? (
                            <li className="p-3">Loading dailies...</li>
                        ) : existingDailies.length === 0 ? (
                            <li className="p-3 text-gray-500">No dailies posted yet.</li>
                        ) : (
                            existingDailies.map((p: any) => (
                                <li key={p.id} className="relative flex flex-col gap-2 bg-brutal-white border-2 border-brutal-border p-4 group">
                                    <div className="flex flex-col items-start gap-2 pr-8 w-full">
                                        <span className="font-heading font-semibold text-sm break-words dark:text-white">{p.title || "Daily Note"}</span>
                                        {p.subTitle && (
                                            <div className="flex flex-wrap gap-1">
                                                {p.subTitle.split(",").filter((m: string) => m.trim().length > 0).map((m: string, i: number) => (
                                                    <BrutalBadge key={i} color="cyan" className="text-[10px] py-0">{m.trim()}</BrutalBadge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => triggerDelete(p.id)}
                                        className="absolute top-2 right-2 bg-brutal-red text-white border-2 border-brutal-border brutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all p-1"
                                        title="Delete Daily"
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
                isOpen={!!dailyToDelete}
                title="Delete Daily Post?"
                message="Are you sure you want to delete this daily post? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                onConfirm={confirmDelete}
                onCancel={() => setDailyToDelete(null)}
            />
        </div>
    );
}
