import { Link } from "react-router";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { TerminalType } from "@/components/ui/MotionEffects";
import { ArrowRight, ServerCrash } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { gridItemsApi } from "@/api/gridItems";

// Mock data removed — relies entirely on API calls


const tagColors = ["yellow", "purple", "cyan", "red", "pink", "blue", "lime", "orange"] as const;

export function DevLogListPage() {
    const { data: devlogs, isError } = useQuery({
        queryKey: ["grid-items", "DevLog"],
        queryFn: async () => {
            try {
                const logItems = await gridItemsApi.getAll("DevLog");
                if (logItems.length === 0) return []; // Fallback empty state

                return logItems.map(item => {
                    // Compute relative time
                    const created = new Date(item.createdAt);
                    const now = new Date();
                    const diffMs = now.getTime() - created.getTime();
                    const diffMin = Math.floor(diffMs / 60000);
                    const diffHr = Math.floor(diffMin / 60);
                    const diffDay = Math.floor(diffHr / 24);
                    const diffWeek = Math.floor(diffDay / 7);
                    const diffMonth = Math.floor(diffDay / 30);
                    const timeAgo = diffMonth > 0 ? `${diffMonth}mo ago`
                        : diffWeek > 0 ? `${diffWeek}w ago`
                            : diffDay > 0 ? `${diffDay}d ago`
                                : diffHr > 0 ? `${diffHr}h ago`
                                    : `${Math.max(diffMin, 1)}m ago`;

                    return {
                        id: item.id,
                        slug: item.id.toString(),
                        title: item.title,
                        excerpt: item.content?.substring(0, 400) + "..." || "",
                        date: new Date(item.createdAt).toISOString().split('T')[0],
                        category: item.tags?.[0] || (item.color === "cyan" ? "React" : item.color === "purple" ? ".NET" : "DevOps"),
                        readTime: timeAgo,
                    };
                });
            } catch (error) {
                console.warn("Backend API unavailable, displaying empty state.");
                return [];
            }
        },
        initialData: [],
    });

    return (
        <div className="w-full mx-auto px-6 md:px-12 xl:px-24 py-16">
            {/* Header */}
            <div className="mb-12">
                <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 inline-block relative">
                    <TerminalType text="DevLog" delay={0.2} />
                    <span className="text-brutal-red">.</span>
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="font-heading text-xl text-brutal-muted max-w-xl mt-4"
                >
                    Technical deep-dives, problem-solving journals, and things I learned the hard way.
                </motion.p>
            </div>

            {/* DevLog List */}
            {isError && (
                <div className="mb-8 p-4 bg-brutal-red text-white flex items-center gap-3 border-3 border-black dark:border-gray-700 brutal-shadow">
                    <ServerCrash className="w-6 h-6" />
                    <p className="font-bold">Backend API is unreachable. Cannot load DevLogs.</p>
                </div>
            )}
            {devlogs.length === 0 && !isError && (
                <div className="mb-8 p-8 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-4 border-black dark:border-gray-700 border-dashed">
                    <p className="font-heading text-2xl font-bold text-gray-400">NO DEVLOGS FOUND IN DATABASE.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[300px] grid-flow-row-dense">
                {devlogs.map((log, index) => {
                    // Pattern for bento sizes targeting 4-col grid
                    const getBentoClasses = (i: number) => {
                        const pattern = i % 7;
                        switch (pattern) {
                            case 0: return "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2"; // Huge
                            case 1: return "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1"; // Standard
                            case 2: return "md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2"; // Tall
                            case 3: return "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1"; // Wide
                            case 4: return "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1"; // Standard
                            case 5: return "md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-1"; // Wide on LG
                            case 6: return "md:col-span-2 md:row-span-1 lg:col-span-1 lg:row-span-1"; // Standard on LG
                            default: return "md:col-span-1 md:row-span-1";
                        }
                    };

                    const bentoClass = getBentoClasses(index);
                    const isGiant = bentoClass.includes("lg:row-span-2") && bentoClass.includes("lg:col-span-2");
                    const isTall = bentoClass.includes("row-span-2") && !isGiant;

                    return (
                        <motion.div
                            className={bentoClass}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                            key={log.id}
                        >
                            <Link to={`/devlog/${log.slug}`} className="block h-full">
                                <BrutalCard hoverable color="white" className="flex flex-col justify-between h-full relative overflow-hidden group">
                                    {/* Background index number — Hollow light gray outline */}
                                    <div
                                        className={`absolute -bottom-4 -right-2 font-heading font-black pointer-events-none select-none z-0 text-transparent ${isGiant ? 'text-[200px]' : isTall ? 'text-[160px]' : 'text-[100px]'}`}
                                        style={{ WebkitTextStroke: '2px rgba(156, 163, 175, 0.4)' }} // Tailwind gray-400 with 40% opacity
                                    >
                                        {String(index + 1).padStart(2, "0")}
                                    </div>

                                    {/* Top: meta + title */}
                                    <div className="flex-1 flex flex-col z-10 min-w-0">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <BrutalBadge color={tagColors[index % tagColors.length]}>
                                                {log.category}
                                            </BrutalBadge>
                                            <span className="font-mono text-xs font-bold opacity-70 bg-white/50 dark:bg-gray-800/50 px-2 py-0.5 border-2 border-black dark:border-gray-700">{log.date}</span>
                                            <span className="font-mono text-xs font-bold opacity-70 bg-white/50 dark:bg-gray-800/50 px-2 py-0.5 border-2 border-black dark:border-gray-700">⏱ {log.readTime}</span>
                                        </div>
                                        <h3 className={`font-heading font-black leading-tight break-words ${isGiant ? 'text-3xl lg:text-4xl' : isTall ? 'text-xl lg:text-2xl' : 'text-lg lg:text-xl'}`}>
                                            {log.title}
                                        </h3>
                                    </div>

                                    {/* Bottom Right Arrow — white with black border for contrast */}
                                    <div className="self-end z-10">
                                        <div className="w-10 h-10 bg-yellow-300 text-black flex items-center justify-center rounded-full border-2 border-black dark:border-gray-700 group-hover:-rotate-45 group-hover:scale-110 transition-all duration-300 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_#333] group-hover:shadow-none group-hover:translate-x-[3px] group-hover:translate-y-[3px]">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </BrutalCard>
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
