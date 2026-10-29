import { Link } from "react-router";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { ArrowRight, ExternalLink, Github, Terminal, Cpu, Database, Layers } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { gridItemsApi, type GridItem } from "@/api/gridItems";

const coreStack = [
    { name: "React 19", color: "cyan" as const, desc: "Modern UI Layer" },
    { name: ".NET 10", color: "purple" as const, desc: "High-Perf Web API" },
    { name: "PostgreSQL 17", color: "blue" as const, desc: "Relational DB" },
    { name: "Docker", color: "cyan" as const, desc: "Containerized Engine" },
    { name: "TypeScript", color: "yellow" as const, desc: "Strict Type Safety" },
    { name: "Tailwind v4", color: "pink" as const, desc: "Tokenized Styling" },
];

export function HomePage() {
    // Fetch real projects from the backend
    const { data: projects = [] } = useQuery<GridItem[]>({
        queryKey: ["grid-items", "Project"],
        queryFn: async () => {
            try {
                return await gridItemsApi.getAll("Project");
            } catch {
                return [];
            }
        },
    });

    // Fetch real devlogs for recent notes
    const { data: devlogs = [] } = useQuery<GridItem[]>({
        queryKey: ["grid-items", "DevLog"],
        queryFn: async () => {
            try {
                return await gridItemsApi.getAll("DevLog");
            } catch {
                return [];
            }
        },
    });

    // Fetch real daily photography
    const { data: dailies = [] } = useQuery<GridItem[]>({
        queryKey: ["grid-items", "Daily"],
        queryFn: async () => {
            try {
                return await gridItemsApi.getAll("Daily");
            } catch {
                return [];
            }
        },
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-24 md:space-y-32">
            {/* ─── Hero Section: Split Stage ─── */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-4 md:pt-10">
                {/* Left: Headline & Actions (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 border-2 border-brutal-border bg-brutal-white px-3 py-1 shadow-[2px_2px_0px_0px_var(--theme-border)]">
                        <span className="w-2.5 h-2.5 bg-brutal-lime rounded-full animate-pulse border border-brutal-border" />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-brutal-black">
                            Monash University · MIT Candidate
                        </span>
                    </div>

                    <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-brutal-black leading-[1.06] overflow-wrap-anywhere">
                        Building Scalable Systems for the Web<span className="text-brutal-yellow">.</span>
                    </h1>

                    <p className="font-mono text-base sm:text-lg text-brutal-muted max-w-2xl leading-relaxed">
                        Full-stack software engineer crafting robust React applications backed by performant .NET architectures and containerized cloud systems.
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-2 pt-2">
                        {coreStack.map((tech) => (
                            <BrutalBadge key={tech.name} color={tech.color} className="text-xs px-2.5 py-1">
                                {tech.name}
                            </BrutalBadge>
                        ))}
                    </div>

                    {/* Primary CTAs */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Link to="/projects">
                            <BrutalButton variant="primary" size="lg" className="flex items-center gap-2">
                                Explore Projects <ArrowRight className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                        <Link to="/devlog">
                            <BrutalButton variant="white" size="lg" className="flex items-center gap-2">
                                Read DevLog <Terminal className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </div>
                </div>

                {/* Right: Hardware & Workstation Render (5 cols) */}
                <div className="lg:col-span-5">
                    <div className="relative group">
                        <div className="relative bg-brutal-white border-2 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-border)] overflow-hidden">
                            <img
                                src="/images/hero-workstation-3d.jpg"
                                alt="High-Performance Developer Workstation Setup"
                                className="w-full aspect-[4/3] object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                                loading="eager"
                            />
                            {/* Overlay Badge */}
                            <div className="absolute bottom-3 left-3 right-3 bg-brutal-white/95 backdrop-blur-sm border-2 border-brutal-border p-3 flex items-center justify-between shadow-[2px_2px_0px_0px_var(--theme-border)]">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-brutal-purple" />
                                    <span className="font-mono text-xs font-bold uppercase text-brutal-black">
                                        Engineering Workstation
                                    </span>
                                </div>
                                <span className="font-mono text-[10px] bg-brutal-yellow text-black font-bold px-2 py-0.5 border border-brutal-border">
                                    2026 Active
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Featured Projects Showcase ─── */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-brutal-border pb-4">
                    <div>
                        <span className="font-mono text-xs font-bold uppercase text-brutal-muted">Portfolio Works</span>
                        <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-brutal-black">
                            Featured Projects<span className="text-brutal-cyan">.</span>
                        </h2>
                    </div>
                    <Link
                        to="/projects"
                        className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 text-brutal-black hover:text-brutal-yellow transition-colors"
                    >
                        View All Projects ({projects.length}) <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.slice(0, 2).map((item) => {
                        const fallbackImage = item.title.includes("Visual")
                            ? "http://localhost:5298/uploads/1815eb90-7439-4bab-95d4-212b1e91ad40.png"
                            : "http://localhost:5298/uploads/17abb75d-ec3e-437d-a787-b20935f2b8fc.png";
                        const imageUrl = item.imageUrl || fallbackImage;

                        return (
                            <div
                                key={item.id}
                                className="bg-brutal-white border-2 border-brutal-border shadow-[6px_6px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_var(--theme-border)] transition-all flex flex-col justify-between overflow-hidden group"
                            >
                                <div className="border-b-2 border-brutal-border bg-brutal-bg overflow-hidden aspect-[16/9]">
                                    <img
                                        src={imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = fallbackImage;
                                        }}
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap gap-2">
                                            {item.tags?.map((tag) => (
                                                <BrutalBadge key={tag} color="yellow" className="text-[10px] px-2 py-0.5">
                                                    {tag}
                                                </BrutalBadge>
                                            ))}
                                        </div>
                                        <h3 className="font-heading text-2xl font-black text-brutal-black uppercase">
                                            {item.title}
                                        </h3>
                                        <p className="font-mono text-xs text-brutal-muted line-clamp-3 leading-relaxed">
                                            {item.content || item.subTitle || "Full-stack application engineered with modern architectural patterns."}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-brutal-border/40">
                                        <Link
                                            to={`/project/${item.id}`}
                                            className="font-heading font-black text-xs uppercase flex items-center gap-1.5 text-brutal-black hover:text-brutal-yellow transition-colors"
                                        >
                                            Detailed Specs <ArrowRight className="w-4 h-4" />
                                        </Link>
                                        {item.githubUrl && (
                                            <a
                                                href={item.githubUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2 border border-brutal-border bg-brutal-bg hover:bg-brutal-yellow hover:text-black transition-colors"
                                                title="GitHub Repository"
                                            >
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── System Architecture & Engineering ─── */}
            <section className="bg-brutal-white border-2 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-border)] p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Visual: 3D Cloud Infrastructure Render (5 cols) */}
                    <div className="lg:col-span-5 border-2 border-brutal-border bg-brutal-bg shadow-[4px_4px_0px_0px_var(--theme-border)] overflow-hidden">
                        <img
                            src="/images/cloud-architecture-3d.jpg"
                            alt="Cloud Architecture & Server Infrastructure"
                            className="w-full aspect-[4/3] object-cover object-center"
                        />
                        <div className="p-3 bg-brutal-white border-t-2 border-brutal-border flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-brutal-black uppercase flex items-center gap-1.5">
                                <Database className="w-4 h-4 text-brutal-cyan" /> Cloud-Native Stack
                            </span>
                            <span className="font-mono text-[10px] text-brutal-muted">Dockerized & Self-Hosted</span>
                        </div>
                    </div>

                    {/* Content: Specs & Capabilities (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div>
                            <span className="font-mono text-xs font-bold uppercase text-brutal-muted">Under the Hood</span>
                            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-brutal-black">
                                Production-Grade Architecture<span className="text-brutal-purple">.</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-brutal-bg border-2 border-brutal-border space-y-2">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-brutal-cyan" />
                                    <h4 className="font-heading font-black text-sm uppercase text-brutal-black">Frontend Engine</h4>
                                </div>
                                <p className="font-mono text-xs text-brutal-muted leading-relaxed">
                                    React 19 SPA, Vite build tool, Tailwind v4 design system, and seamless View Transitions API theming.
                                </p>
                            </div>

                            <div className="p-4 bg-brutal-bg border-2 border-brutal-border space-y-2">
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-4 h-4 text-brutal-purple" />
                                    <h4 className="font-heading font-black text-sm uppercase text-brutal-black">Backend Services</h4>
                                </div>
                                <p className="font-mono text-xs text-brutal-muted leading-relaxed">
                                    ASP.NET Core 10 Web API, Entity Framework Core ORM, ASP.NET Core Identity authentication with JWTs.
                                </p>
                            </div>

                            <div className="p-4 bg-brutal-bg border-2 border-brutal-border space-y-2">
                                <div className="flex items-center gap-2">
                                    <Database className="w-4 h-4 text-brutal-blue" />
                                    <h4 className="font-heading font-black text-sm uppercase text-brutal-black">Database Storage</h4>
                                </div>
                                <p className="font-mono text-xs text-brutal-muted leading-relaxed">
                                    PostgreSQL 17 deployed in Docker, automated relational schema migrations, and physical file static routing.
                                </p>
                            </div>

                            <div className="p-4 bg-brutal-bg border-2 border-brutal-border space-y-2">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-brutal-lime" />
                                    <h4 className="font-heading font-black text-sm uppercase text-brutal-black">Telemetry & Analytics</h4>
                                </div>
                                <p className="font-mono text-xs text-brutal-muted leading-relaxed">
                                    Session-deduplicated hit tracking, visitor geolocation/IP leaderboard, and real-time trend analytics.
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link to="/components">
                                <BrutalButton variant="cyan" size="md" className="flex items-center gap-2">
                                    Inspect Component Library <ArrowRight className="w-4 h-4" />
                                </BrutalButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Recent DevLogs & Engineering Notes ─── */}
            <section className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-brutal-border pb-4">
                    <div>
                        <span className="font-mono text-xs font-bold uppercase text-brutal-muted">Learning in Public</span>
                        <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-brutal-black">
                            Engineering DevLogs<span className="text-brutal-yellow">.</span>
                        </h2>
                    </div>
                    <Link
                        to="/devlog"
                        className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 text-brutal-black hover:text-brutal-yellow transition-colors"
                    >
                        View All Entries ({devlogs.length}) <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {devlogs.slice(0, 3).map((log) => (
                        <Link
                            key={log.id}
                            to={`/devlog/${log.id}`}
                            className="bg-brutal-white border-2 border-brutal-border p-6 shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex flex-col justify-between group"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-[10px] bg-brutal-bg text-brutal-muted border border-brutal-border px-2 py-0.5 uppercase font-bold">
                                        {log.tags?.[0] || "DEVLOG"}
                                    </span>
                                    <span className="font-mono text-[10px] text-brutal-muted">
                                        {new Date(log.updatedAt || log.createdAt || Date.now()).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </span>
                                </div>
                                <h3 className="font-heading text-lg font-black uppercase text-brutal-black group-hover:text-brutal-yellow transition-colors leading-snug">
                                    {log.title}
                                </h3>
                                <p className="font-mono text-xs text-brutal-muted line-clamp-3 leading-relaxed">
                                    {log.content || log.problemDescription || "Technical breakdown and solution pattern implemented in code."}
                                </p>
                            </div>
                            <div className="pt-4 mt-4 border-t border-brutal-border/30 flex items-center justify-between text-xs font-mono font-bold uppercase text-brutal-black">
                                <span>Read Entry</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ─── Visual Moments & Photography ─── */}
            {dailies.length > 0 && (
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-brutal-border pb-4">
                        <div>
                            <span className="font-mono text-xs font-bold uppercase text-brutal-muted">Behind the Screen</span>
                            <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-brutal-black">
                                Life & Photography<span className="text-brutal-pink">.</span>
                            </h2>
                        </div>
                        <Link
                            to="/daily"
                            className="font-mono text-xs font-bold uppercase flex items-center gap-1.5 text-brutal-black hover:text-brutal-pink transition-colors"
                        >
                            View Visual Timeline <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {dailies.slice(0, 2).map((daily) => (
                            <Link
                                key={daily.id}
                                to={`/daily/${daily.id}`}
                                className="bg-brutal-white border-2 border-brutal-border shadow-[6px_6px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--theme-border)] transition-all overflow-hidden group block"
                            >
                                {daily.imageUrl && (
                                    <div className="aspect-[16/10] overflow-hidden border-b-2 border-brutal-border bg-brutal-bg">
                                        <img
                                            src={daily.imageUrl}
                                            alt={daily.title}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-heading font-black text-xl uppercase text-brutal-black">
                                            {daily.title}
                                        </span>
                                        <div className="flex gap-1.5">
                                            {daily.tags?.map((tag) => (
                                                <BrutalBadge key={tag} color="pink" className="text-[10px] px-2 py-0.5">
                                                    {tag}
                                                </BrutalBadge>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="font-mono text-xs text-brutal-muted line-clamp-2">
                                        {daily.content}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* ─── Footer CTA ─── */}
            <section className="bg-brutal-white border-2 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-border)] p-8 sm:p-12 text-center space-y-6">
                <h2 className="font-heading text-3xl sm:text-5xl font-black uppercase text-brutal-black">
                    Let's Build Something Exceptional<span className="text-brutal-lime">.</span>
                </h2>
                <p className="font-mono text-sm sm:text-base text-brutal-muted max-w-xl mx-auto leading-relaxed">
                    Always interested in challenging full-stack engineering problems, modern web architectures, and collaborative open-source projects.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                    <a
                        href="https://github.com/JohnChuhengYu"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-brutal-bg text-brutal-black hover:bg-brutal-yellow hover:text-black border-2 border-brutal-border px-6 py-3 font-heading font-bold text-sm shadow-[3px_3px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                        <Github className="w-4 h-4" /> GitHub Profile
                    </a>
                    <a
                        href="https://www.linkedin.com/in/chuhengyu"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-brutal-bg text-brutal-black hover:bg-brutal-cyan hover:text-black border-2 border-brutal-border px-6 py-3 font-heading font-bold text-sm shadow-[3px_3px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                        <ExternalLink className="w-4 h-4" /> LinkedIn
                    </a>
                </div>
            </section>
        </div>
    );
}
