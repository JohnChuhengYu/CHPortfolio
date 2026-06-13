import { Link } from "react-router";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BlockReveal } from "@/components/ui/MotionEffects";
import { Github, ArrowRight, ServerCrash } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { gridItemsApi } from "@/api/gridItems";

// Mock data removed — relies entirely on API calls via TanStack Query

const tagColors = ["yellow", "purple", "cyan", "red", "pink", "blue", "green", "orange"] as const;

export function ProjectsPage() {
    const { data: projects, isError } = useQuery({
        queryKey: ["grid-items", "Project"],
        queryFn: async () => {
            try {
                // Filter and map backend GridItem format to what the component expects
                const projectItems = await gridItemsApi.getAll("Project");
                if (projectItems.length === 0) return []; // Empty state

                return projectItems.map(item => ({
                    id: item.id,
                    slug: item.id.toString(), // Simplification, could be a real slug
                    title: item.title,
                    description: item.content || "",
                    imageUrl: item.imageUrl || "https://placehold.co/600x400/ffde59/000?text=No+Image",
                    tags: item.tags || [],
                    githubUrl: item.githubUrl || null,
                    gridSpanX: item.gridSpanX,
                    gridSpanY: item.gridSpanY,
                }));
            } catch (error) {
                console.warn("Backend API unavailable.");
                return [];
            }
        },
        initialData: [],
    });

    return (
        <div className="px-6 py-24 md:py-32 w-full">
            {/* Header */}
            <div className="mb-16 md:mb-24">
                <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tighter mb-4 inline-block relative">
                    <BlockReveal delay={0.2} boxColor="bg-brutal-purple">
                        Projects<span className="text-brutal-purple">.</span>
                    </BlockReveal>
                </h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-heading text-xl text-brutal-muted max-w-xl mt-4"
                >
                    Things I've built, broken, and shipped. Click any card to explore the DevLog.
                </motion.p>
            </div>

            {/* Project Grid */}
            {isError && (
                <div className="mb-8 p-4 bg-brutal-red text-white flex items-center gap-3 border-3 border-black dark:border-gray-700 brutal-shadow">
                    <ServerCrash className="w-6 h-6" />
                    <p className="font-bold">Backend API is unreachable. Cannot load projects.</p>
                </div>
            )}

            {projects.length === 0 && !isError && (
                <div className="mb-8 p-8 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border-4 border-black dark:border-gray-700 border-dashed">
                    <p className="font-heading text-2xl font-bold text-gray-400">NO PROJECTS FOUND IN DATABASE.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {projects.map((project, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ type: "spring", stiffness: 100, damping: 15, delay: (index % 2) * 0.1 }}
                        key={project.id}
                        className="flex flex-col h-full"
                    >
                        <BrutalCard
                            hoverable
                            noPadding
                            className="h-full overflow-hidden flex flex-col transition-transform duration-300"
                        >
                            {/* Project Image */}
                            <Link to={`/project/${project.id}`}>
                                <div className="border-b-3 border-black dark:border-gray-700 overflow-hidden relative group aspect-video">
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-white/10 transition-colors z-10 pointer-events-none" />
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </Link>

                            {/* Content */}
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <Link to={`/project/${project.id}`}>
                                    <h3 className="font-heading font-bold mb-3 hover:text-brutal-purple transition-colors text-3xl">
                                        {project.title}
                                    </h3>
                                </Link>
                                <p className="text-brutal-black/70 dark:text-gray-400 mb-6 flex-1 text-lg">
                                    {project.description}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tags.map((tag, i) => (
                                        <BrutalBadge key={tag} color={tagColors[i % tagColors.length]} className="px-3 py-1.5 text-xs">
                                            {tag}
                                        </BrutalBadge>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 mt-auto">
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                            <BrutalButton variant="black" size="md" className="flex items-center justify-center gap-2 w-full hover:bg-gray-800 transition-colors">
                                                <Github className="w-4 h-4" /> GitHub
                                            </BrutalButton>
                                        </a>
                                    )}
                                    <Link to={`/project/${project.id}`} className="flex-1">
                                        <BrutalButton variant="primary" size="md" className="flex items-center justify-center gap-2 w-full">
                                            View Details <ArrowRight className="w-4 h-4" />
                                        </BrutalButton>
                                    </Link>
                                </div>
                            </div>
                        </BrutalCard>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
