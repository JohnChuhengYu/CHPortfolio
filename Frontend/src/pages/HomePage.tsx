import { Link } from "react-router";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import {
    ArrowRight,
    ArrowDown,
    ExternalLink,
    Github,
    Terminal,
    Cpu,
    Database,
    Layers,
    GraduationCap,
    Zap,
    Wrench,
    Lightbulb,
    Sparkles,
    Palette,
    Server,
    Activity,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import {
    DrawUnderline,
    PopDot,
    SlapTag,
    BlockReveal,
    TerminalType,
    HoverTiltCard,
} from "@/components/ui/MotionEffects";
import { useQuery } from "@tanstack/react-query";
import { gridItemsApi, type GridItem } from "@/api/gridItems";

// Core skills configuration
const skills = [
    { label: "React 19", color: "cyan" as const },
    { label: ".NET 10", color: "purple" as const },
    { label: "TypeScript", color: "blue" as const },
    { label: "PostgreSQL 17", color: "orange" as const },
    { label: "Docker", color: "cyan" as const },
    { label: "Tailwind v4", color: "pink" as const },
];

// Framer motion variants
const heroContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const heroBadgeVariants: Variants = {
    hidden: { opacity: 0, scale: 0.6, y: -20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 18 },
    },
};

const heroTitleVariants: Variants = {
    hidden: { opacity: 0, y: 60, clipPath: "inset(100% 0 0 0)" },
    visible: {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0 0 0)",
        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
};

const heroTaglineVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

const heroButtonsContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.1, delayChildren: 0.4 },
    },
};

const heroButtonVariants: Variants = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 350, damping: 20 },
    },
};

const aboutCardsContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const aboutCardVariants: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.96 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
        },
    },
};

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
        <div className="w-full flex flex-col items-center overflow-x-hidden">
            {/* ═══════════════════════════════════════════════════════════════
                1. IMMERSIVE FULL-VIEWPORT HERO ENTRANCE (MAX IMPACT & MOTION)
               ═══════════════════════════════════════════════════════════════ */}
            <motion.section
                variants={heroContainerVariants}
                initial="hidden"
                animate="visible"
                className="min-h-[calc(100vh-100px)] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-8 py-12 relative text-center"
            >
                {/* Decorative Top Badge */}
                <motion.div variants={heroBadgeVariants}>
                    <div className="inline-flex items-center gap-2.5 border-2 border-brutal-border bg-brutal-white px-5 py-2 shadow-[3px_3px_0px_0px_var(--theme-border)]">
                        <span className="w-2.5 h-2.5 bg-brutal-lime rounded-full animate-pulse border border-brutal-border" />
                        <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-brutal-black">
                            Full-Stack Developer · Monash University MIT Candidate
                        </span>
                    </div>
                </motion.div>

                {/* Giant Headline */}
                <motion.h1
                    variants={heroTitleVariants}
                    className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-[0.92] tracking-tighter text-brutal-black"
                >
                    Hi, I'm{" "}
                    <span className="relative inline-block">
                        <span className="relative z-10">CH</span>
                        <DrawUnderline />
                    </span>
                    <PopDot delay={0.9} className="text-brutal-purple text-5xl md:text-8xl lg:text-9xl align-baseline" />
                </motion.h1>

                {/* Animated Tagline with Bouncing Tags */}
                <motion.p
                    variants={heroTaglineVariants}
                    className="font-heading text-xl sm:text-2xl md:text-3xl max-w-4xl leading-relaxed md:leading-[1.7] text-brutal-black/85"
                >
                    I build high-performance web systems with{" "}
                    <SlapTag delay={0.5} rotate={-3} className="bg-brutal-cyan text-black px-3 py-1 border-2 border-brutal-border font-bold shadow-[2px_2px_0px_0px_var(--theme-border)] mx-1.5 my-1 inline-block">
                        React 19
                    </SlapTag>{" "}
                    and{" "}
                    <SlapTag delay={0.65} rotate={2} className="bg-brutal-purple text-white px-3 py-1 border-2 border-brutal-border font-bold shadow-[2px_2px_0px_0px_var(--theme-border)] mx-1.5 my-1 inline-block">
                        .NET 10
                    </SlapTag>.<br className="hidden sm:inline" />
                    <span className="mt-2 inline-block">
                        Master of Information Technology @{" "}
                        <SlapTag delay={0.8} rotate={-2} className="bg-brutal-yellow text-black px-3 py-1 border-2 border-brutal-border font-bold shadow-[2px_2px_0px_0px_var(--theme-border)] mx-1.5 my-1 inline-block">
                            Monash University
                        </SlapTag>.
                    </span>
                </motion.p>

                {/* Staggered Action CTAs */}
                <motion.div
                    variants={heroButtonsContainerVariants}
                    className="flex flex-wrap justify-center gap-4 sm:gap-6 pt-4"
                >
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/projects">
                            <BrutalButton variant="primary" size="lg" className="flex items-center gap-2">
                                Explore Projects <ArrowRight className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/daily">
                            <BrutalButton variant="cyan" size="lg" className="flex items-center gap-2">
                                My Daily Life <Sparkles className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/devlog">
                            <BrutalButton variant="white" size="lg" className="flex items-center gap-2">
                                Read DevLog <Terminal className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/components">
                            <BrutalButton variant="black" size="lg" className="flex items-center gap-2">
                                Design System <Palette className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Bouncing Scroll Guide */}
                <motion.button
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    onClick={() => {
                        document.getElementById("workstation-section")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="flex flex-col items-center gap-1.5 text-brutal-muted hover:text-brutal-black font-mono text-xs uppercase font-bold pt-8 cursor-pointer transition-colors"
                >
                    <span>Scroll to Explore</span>
                    <ArrowDown className="w-4 h-4 text-brutal-black" />
                </motion.button>
            </motion.section>

            {/* ═══════════════════════════════════════════════════════════════
                2. DEVELOPER WORKSTATION & COMMAND CENTER (HIGH IMPACT 3D)
               ═══════════════════════════════════════════════════════════════ */}
            <section id="workstation-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-brutal-white border-2 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-border)] p-6 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Left: 3D Developer Workstation in HoverTiltCard (Strictly NO human figures) */}
                        <div className="lg:col-span-7">
                            <HoverTiltCard>
                                <div className="relative border-2 border-brutal-border bg-brutal-bg shadow-[6px_6px_0px_0px_var(--theme-border)] overflow-hidden group">
                                    <img
                                        src="/images/hero-workstation-3d.jpg"
                                        alt="High-Performance Developer Workstation Setup"
                                        className="w-full aspect-[16/10] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                        loading="eager"
                                    />

                                    {/* Top Corner Badges */}
                                    <div className="absolute top-3 left-3 bg-brutal-white/95 backdrop-blur-sm border-2 border-brutal-border px-3 py-1 flex items-center gap-2 shadow-[2px_2px_0px_0px_var(--theme-border)]">
                                        <Cpu className="w-3.5 h-3.5 text-brutal-purple" />
                                        <span className="font-mono text-xs font-bold uppercase text-brutal-black">
                                            Developer Rig
                                        </span>
                                    </div>

                                    <div className="absolute top-3 right-3 bg-brutal-yellow text-black font-mono text-xs font-bold uppercase px-3 py-1 border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)]">
                                        ● 2026 Active
                                    </div>

                                    {/* Bottom Rig Spec Banner */}
                                    <div className="absolute bottom-3 left-3 right-3 bg-brutal-white/95 backdrop-blur-md border-2 border-brutal-border px-3 py-2 flex items-center justify-between shadow-[2px_2px_0px_0px_var(--theme-border)]">
                                        <span className="font-mono text-xs font-bold text-brutal-black flex items-center gap-2">
                                            <Terminal className="w-3.5 h-3.5 text-brutal-lime" />
                                            Hardware Engine: 4K Dual Displays · M-Series Rig
                                        </span>
                                        <span className="font-mono text-[10px] uppercase font-bold text-brutal-muted hidden sm:inline">
                                            3D Interactive Tilt
                                        </span>
                                    </div>
                                </div>
                            </HoverTiltCard>
                        </div>

                        {/* Right: Command Center Telemetry & Quick Specs */}
                        <div className="lg:col-span-5 space-y-6">
                            <div>
                                <span className="font-mono text-xs font-bold uppercase text-brutal-muted">Hardware & Environment</span>
                                <h2 className="font-heading text-3xl sm:text-4xl font-black uppercase text-brutal-black">
                                    Engineering Command Center<span className="text-brutal-yellow">.</span>
                                </h2>
                            </div>

                            <p className="font-mono text-sm text-brutal-muted leading-relaxed">
                                Engineered for low-latency iteration, rapid local container testing, and strict type verification across the entire web stack.
                            </p>

                            <div className="space-y-3 pt-2">
                                <div className="p-3 bg-brutal-bg border-2 border-brutal-border flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold uppercase text-brutal-black flex items-center gap-2">
                                        <Server className="w-4 h-4 text-brutal-cyan" /> Architecture
                                    </span>
                                    <span className="font-mono text-xs font-bold text-brutal-black">React 19 + .NET 10 API</span>
                                </div>
                                <div className="p-3 bg-brutal-bg border-2 border-brutal-border flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold uppercase text-brutal-black flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-brutal-lime" /> Deployment
                                    </span>
                                    <span className="font-mono text-xs font-bold text-brutal-black">Dockerized Self-Hosted</span>
                                </div>
                                <div className="p-3 bg-brutal-bg border-2 border-brutal-border flex items-center justify-between">
                                    <span className="font-mono text-xs font-bold uppercase text-brutal-black flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4 text-brutal-purple" /> Institution
                                    </span>
                                    <span className="font-mono text-xs font-bold text-brutal-black">Monash University (MIT)</span>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-4">
                                <Link to="/projects">
                                    <BrutalButton variant="primary" size="md" className="flex items-center gap-2">
                                        View Projects <ArrowRight className="w-4 h-4" />
                                    </BrutalButton>
                                </Link>
                                <Link to="/components">
                                    <BrutalButton variant="white" size="md" className="flex items-center gap-2">
                                        Design Specs <Palette className="w-4 h-4" />
                                    </BrutalButton>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                3. ABOUT ME & ENGINEERING DNA (ANIMATED BENTO GRID)
               ═══════════════════════════════════════════════════════════════ */}
            <section id="about-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="mb-12 flex items-center justify-between border-b-2 border-brutal-border pb-4"
                >
                    <h2 className="font-heading text-4xl sm:text-5xl font-black uppercase text-brutal-black flex items-center">
                        About Me
                        <motion.span
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 350, damping: 12, delay: 0.2 }}
                            className="text-brutal-red ml-1 text-5xl leading-none inline-block"
                        >
                            <motion.span
                                animate={{ opacity: [1, 0.2, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="inline-block"
                            >
                                .
                            </motion.span>
                        </motion.span>
                    </h2>
                    <span className="font-mono text-xs font-bold uppercase text-brutal-muted hidden sm:inline">
                        Architecture · Foundations · Mindset
                    </span>
                </motion.div>

                <motion.div
                    variants={aboutCardsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8"
                >
                    {/* Card 1: Education (Spans 2 cols, 2 rows) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 md:row-span-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="yellow" hoverable className="h-full flex flex-col justify-between">
                            <div>
                                <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase mb-4 flex items-center gap-2.5">
                                    <GraduationCap className="w-7 h-7" /> Education & Background
                                </h3>
                                <div className="text-base sm:text-lg leading-relaxed text-black/90">
                                    <BlockReveal delay={0.4} boxColor="bg-brutal-purple">
                                        Master of Information Technology candidate at{" "}
                                        <span className="font-bold underline decoration-4 decoration-black">
                                            Monash University
                                        </span>.
                                        Driven by building clean, high-performance web applications that bridge intuitive user experiences with resilient backend architectures.
                                    </BlockReveal>
                                </div>
                            </div>
                            <div className="pt-6 mt-6 border-t border-black/20 flex items-center justify-between font-mono text-xs font-bold uppercase">
                                <span>Clayton, Melbourne</span>
                                <span>2025 – Present</span>
                            </div>
                        </BrutalCard>
                    </motion.div>

                    {/* Card 2: What I Do (Spans 2 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="purple" hoverable className="text-white h-full">
                            <h3 className="font-heading text-2xl font-black uppercase mb-3 flex items-center gap-2.5">
                                <Zap className="w-6 h-6 text-brutal-yellow" /> Core Focus
                            </h3>
                            <div className="text-sm sm:text-base leading-relaxed text-white/95 min-h-[60px]">
                                <TerminalType
                                    text="Full-stack engineering focused on React 19 UI, .NET 10 microservices, and containerized Docker systems."
                                    delay={0.5}
                                    speed={25}
                                    promptColor="text-brutal-yellow"
                                    cursorColor="bg-brutal-yellow"
                                />
                            </div>
                        </BrutalCard>
                    </motion.div>

                    {/* Card 3: Cloud Infrastructure (Spans 2 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 flex flex-col h-full transform-gpu">
                        <HoverTiltCard className="h-full">
                            <div className="bg-brutal-white border-2 border-brutal-border shadow-[4px_4px_0px_0px_var(--theme-border)] p-4 h-full flex flex-col justify-between group overflow-hidden">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-heading text-xl font-black uppercase flex items-center gap-2 text-brutal-black">
                                            <Database className="w-5 h-5 text-brutal-cyan" /> Cloud Architecture
                                        </h3>
                                        <span className="font-mono text-[10px] bg-brutal-cyan text-black font-bold px-2 py-0.5 border border-brutal-border">
                                            Dockerized
                                        </span>
                                    </div>
                                    <div className="aspect-[16/8] overflow-hidden border-2 border-brutal-border bg-brutal-bg">
                                        <img
                                            src="/images/cloud-architecture-3d.jpg"
                                            alt="Cloud Architecture 3D Model"
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                                <p className="font-mono text-xs text-brutal-muted pt-3">
                                    PostgreSQL 17, containerized services, and automated CI/CD deployment pipelines.
                                </p>
                            </div>
                        </HoverTiltCard>
                    </motion.div>

                    {/* Card 4: Tech Stack (Spans 2 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="cyan" hoverable className="h-full flex flex-col justify-between">
                            <div>
                                <h3 className="font-heading text-2xl font-black uppercase mb-3 flex items-center gap-2.5 text-black">
                                    <Wrench className="w-6 h-6" /> Tech Stack
                                </h3>
                                <div className="flex flex-wrap gap-2.5 mt-3">
                                    {skills.map((skill, i) => (
                                        <motion.div
                                            key={skill.label}
                                            initial={{ opacity: 0, scale: 0.5, y: 15 }}
                                            whileInView={{
                                                opacity: 1,
                                                scale: 1,
                                                y: 0,
                                                transition: { delay: 0.6 + i * 0.08, type: "spring", stiffness: 400, damping: 14 },
                                            }}
                                            viewport={{ once: true }}
                                            className="inline-block"
                                        >
                                            <BrutalBadge color={skill.color} className="px-3 py-1.5 text-xs font-bold border-2 border-black text-black">
                                                {skill.label}
                                            </BrutalBadge>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            <span className="font-mono text-[11px] text-black/70 pt-4">
                                Production-validated toolchain.
                            </span>
                        </BrutalCard>
                    </motion.div>

                    {/* Card 5: Engineering Philosophy (Spans all 4 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-4 flex flex-col h-full transform-gpu">
                        <BrutalCard color="white" hoverable className="h-full">
                            <h3 className="font-heading text-2xl sm:text-3xl font-black uppercase mb-4 flex items-center gap-2.5 text-brutal-black">
                                <Lightbulb className="w-7 h-7 text-brutal-yellow" /> Engineering Philosophy
                            </h3>
                            <div className="text-base sm:text-xl leading-relaxed max-w-5xl text-brutal-black/90">
                                <BlockReveal delay={0.8} boxColor="bg-brutal-yellow">
                                    I believe in{" "}
                                    <span className="font-bold bg-brutal-yellow text-black px-2 py-0.5 border-2 border-brutal-border inline-block shadow-[2px_2px_0px_0px_var(--theme-border)]">
                                        shipping fast
                                    </span>
                                    , iterating often, and embracing the latest tools. Every project in this portfolio is a testament to learning by building real production software — not just reading documentation.
                                </BlockReveal>
                            </div>
                        </BrutalCard>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                4. FEATURED PROJECTS SHOWCASE (REAL BACKEND DATA)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-brutal-border pb-4">
                    <div>
                        <span className="font-mono text-xs font-bold uppercase text-brutal-muted">Selected Works</span>
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
                                className="bg-brutal-white border-2 border-brutal-border shadow-[6px_6px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--theme-border)] transition-all flex flex-col justify-between overflow-hidden group"
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

            {/* ═══════════════════════════════════════════════════════════════
                5. SYSTEM ARCHITECTURE & ENGINEERING SPECS
               ═══════════════════════════════════════════════════════════════ */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-brutal-white border-2 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-border)] p-6 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        {/* Visual: 3D Cloud Infrastructure Render */}
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

                        {/* Specs Grid */}
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
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                6. RECENT DEVLOGS (LEARNING IN PUBLIC)
               ═══════════════════════════════════════════════════════════════ */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
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

            {/* ═══════════════════════════════════════════════════════════════
                7. VISUAL MOMENTS & PHOTOGRAPHY
               ═══════════════════════════════════════════════════════════════ */}
            {dailies.length > 0 && (
                <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
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

            {/* ═══════════════════════════════════════════════════════════════
                8. FOOTER CONTACT & CALL TO ACTION
               ═══════════════════════════════════════════════════════════════ */}
            <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-brutal-white border-2 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-border)] p-8 sm:p-12 text-center space-y-6">
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
                </div>
            </section>
        </div>
    );
}
