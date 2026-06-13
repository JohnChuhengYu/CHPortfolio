import { useState, useOptimistic, useEffect } from "react";
import { Link } from "react-router";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalInput } from "@/components/ui/BrutalInput";
import { WavyText, PopDot } from "@/components/ui/MotionEffects";
import { ServerCrash } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { gridItemsApi } from "@/api/gridItems";

interface DailyPost {
    id: number;
    title: string;
    content: string;
    date: string;
    mood: string;
    isPending?: boolean;
}

const stickyColors = ["yellow", "pink", "blue", "cyan", "orange"] as const;

// Mock data removed

export function DailyTimelinePage() {
    const { data: fetchedPosts, isError } = useQuery({
        queryKey: ["grid-items", "Daily"],
        queryFn: async () => {
            try {
                const dailyItems = await gridItemsApi.getAll("Daily");
                if (dailyItems.length === 0) return [];

                return dailyItems.map(item => ({
                    id: item.id as unknown as number,
                    title: item.title,
                    content: item.content || "",
                    date: new Date(item.createdAt).toISOString().split('T')[0],
                    mood: item.subTitle || "✨",
                }));
            } catch (error) {
                console.warn("Backend API unavailable.");
                return [];
            }
        },
        initialData: [],
    });

    const [posts, setPosts] = useState<DailyPost[]>([]);

    useEffect(() => {
        if (fetchedPosts) {
            setPosts(fetchedPosts);
        }
    }, [fetchedPosts]);

    const [optimisticPosts, addOptimisticPost] = useOptimistic<DailyPost[], DailyPost>(
        posts,
        (currentPosts, newPost) => [{ ...newPost, isPending: true }, ...currentPosts]
    );

    // Only show the post form for admin users
    const storedEmail = localStorage.getItem("ch_email") || "";
    const isAdmin = storedEmail === "admin@chportfolio.dev" || storedEmail === "ych0911y@gmail.com";

    async function handlePost(formData: FormData) {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const mood = formData.get("mood") as string;

        if (!content?.trim()) return;

        const newPost: DailyPost = {
            id: Date.now(),
            title: title || "Daily Note",
            content: content.trim(),
            date: new Date().toISOString().split("T")[0],
            mood: mood || "✨",
        };

        // Optimistically add to UI
        addOptimisticPost(newPost);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // After "server confirms", update real state
        setPosts((prev) => [newPost, ...prev]);
    }

    return (
        <div className="max-w-3xl w-full mx-auto px-6 py-16">
            {/* Header */}
            <div className="mb-12">
                <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 inline-block relative">
                    <WavyText text="Daily" delay={0.1} />
                    <PopDot delay={0.6} className="text-brutal-yellow absolute -right-6 bottom-0" />
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-heading text-xl text-brutal-muted max-w-xl mt-4"
                >
                    Random thoughts, coding wins, and daily adventures — like sticky notes on a wall.
                </motion.p>
            </div>

            {isError && (
                <div className="mb-8 p-4 bg-brutal-red text-white flex items-center gap-3 border-3 border-black dark:border-gray-700 brutal-shadow">
                    <ServerCrash className="w-6 h-6" />
                    <p className="font-bold">Backend API is unreachable. Cannot load daily posts.</p>
                </div>
            )}
            {posts.length === 0 && !isError && (
                <div className="mb-8 p-8 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-4 border-black dark:border-gray-700 border-dashed">
                    <p className="font-heading text-2xl font-bold text-gray-400">NO DAILY POSTS YET.</p>
                </div>
            )}

            {/* Post Form (admin only) */}
            {isAdmin && (
                <BrutalCard color="yellow" className="mb-10">
                    <form
                        action={handlePost}
                        className="flex flex-col gap-4"
                    >
                        <BrutalInput
                            name="title"
                            placeholder="Title..."
                            required
                        />
                        <BrutalInput
                            name="content"
                            placeholder="What's on your mind today?"
                            required
                        />
                        <BrutalInput
                            name="mood"
                            placeholder="Mood (emoji or text)..."
                        />
                        <div className="flex justify-end">
                            <BrutalButton type="submit" variant="primary" size="sm">
                                Post It!
                            </BrutalButton>
                        </div>
                    </form>
                </BrutalCard>
            )}

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-1 bg-black dark:bg-gray-700" />

                <div className="flex flex-col gap-6">
                    {optimisticPosts.map((post, index) => {
                        const color = stickyColors[index % stickyColors.length];
                        return (
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                                key={post.id}
                            >
                                <div className="flex items-start gap-4 pl-14 relative">
                                    {/* Timeline Dot */}
                                    <div className="absolute left-4 top-4 w-5 h-5 bg-black dark:bg-gray-500 border-3 border-black dark:border-gray-700 rounded-full z-10" />

                                    {/* Sticky Note Card */}
                                    <Link to={`/daily/${post.id}`} className="flex-1">
                                        <BrutalCard
                                            color={color}
                                            hoverable
                                            className={[
                                                "h-full rotate-[var(--rotation)]",
                                                post.isPending && "opacity-60",
                                            ].filter(Boolean).join(" ")}
                                            style={{
                                                "--rotation": `${(index % 2 === 0 ? 1 : -1) * (Math.random() * 1.5 + 0.5)}deg`,
                                            } as React.CSSProperties}
                                        >
                                            {/* Header */}
                                            <div className="flex items-start justify-between mb-4 border-b-2 border-black dark:border-gray-500 pb-2">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="font-heading font-black text-xl uppercase break-words leading-tight">
                                                        {post.title}
                                                    </h3>
                                                    <BrutalBadge color="yellow" className="text-[10px] px-2 py-0.5 w-fit">
                                                        {post.date}
                                                    </BrutalBadge>
                                                </div>
                                                <div className="flex flex-wrap gap-2 justify-end max-w-[40%]">
                                                    {(post.mood || "✨").split(",").map((m, i) => (
                                                        <BrutalBadge
                                                            key={i}
                                                            color={stickyColors[(index + i) % stickyColors.length]}
                                                            className="px-3 py-1.5 text-[10px] shadow-[2px_2px_0_0_#000] dark:shadow-[2px_2px_0_0_#333] hover:shadow-[3px_3px_0_0_#000] dark:hover:shadow-[3px_3px_0_0_#333]"
                                                        >
                                                            {m.trim()}
                                                        </BrutalBadge>
                                                    ))}
                                                </div>
                                            </div>



                                            {post.isPending && (
                                                <p className="text-sm font-mono text-brutal-muted mt-2 animate-pulse">
                                                    Posting...
                                                </p>
                                            )}
                                        </BrutalCard>
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
