import { Link } from "react-router";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { GraduationCap, Zap, Wrench, Lightbulb, Sparkles, ArrowRight, Palette } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { DrawUnderline, PopDot, SlapTag, TerminalType, BlockReveal } from "@/components/ui/MotionEffects";

const skills = [
    { label: "React 19", color: "cyan" as const },
    { label: ".NET 10", color: "purple" as const },
    { label: "TypeScript", color: "blue" as const },
    { label: "PostgreSQL", color: "orange" as const },
    { label: "Docker", color: "cyan" as const },
    { label: "Tailwind CSS", color: "yellow" as const },
];

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
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 500, damping: 15 }
    }
};

const heroTitleVariants: Variants = {
    hidden: { opacity: 0, y: 50, clipPath: "inset(100% 0 0 0)" },
    visible: {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0 0 0)",
        transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
    },
};

const heroTaglineVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" }
    },
};

const heroButtonsContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 }
    }
};

const heroButtonVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 350, damping: 20 }
    }
};

const aboutCardsContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        },
    },
};

const aboutCardVariants: Variants = {
    hidden: { opacity: 0, y: 100, rotate: 5, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 18,
        },
    },
};

export function HomePage() {
    return (
        <div className="px-6 py-8 w-full overflow-hidden">
            {/* ─── Hero Section ─── */}
            <motion.section
                variants={heroContainerVariants}
                initial="hidden"
                animate="visible"
                className="min-h-[calc(100vh-140px)] flex flex-col justify-center items-center gap-8 py-12"
            >
                {/* Decorative tag */}
                <motion.div variants={heroBadgeVariants}>
                    <BrutalBadge color="cyan" className="px-10 py-6 text-xl mb-2 md:mb-6">
                        Full-Stack Developer
                    </BrutalBadge>
                </motion.div>

                {/* Giant heading */}
                <motion.h1
                    variants={heroTitleVariants}
                    className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold leading-[0.95] tracking-tighter mb-4 text-center"
                >
                    Hi, I'm{" "}
                    <span className="relative inline-block">
                        <span className="relative z-10">CH</span>
                        <DrawUnderline />
                    </span>
                    <PopDot delay={0.9} className="text-brutal-purple text-5xl md:text-8xl lg:text-9xl align-baseline" />
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    variants={heroTaglineVariants}
                    className="font-heading text-xl md:text-3xl max-w-4xl mb-10 leading-loose md:leading-[1.8] text-brutal-black/80 text-center"
                >
                    I build things for the web with{" "}
                    <SlapTag delay={0.6} rotate={-3} className="bg-brutal-cyan text-black px-3 py-1.5 border-2 border-black dark:border-gray-700 font-bold brutal-interactive mx-2 my-1 md:my-0">React</SlapTag> and{" "}
                    <SlapTag delay={0.7} rotate={2} className="bg-brutal-purple text-white px-3 py-1.5 border-2 border-black dark:border-gray-700 font-bold brutal-interactive mx-2 my-1 md:my-0">.NET</SlapTag>.<br className="hidden md:block" />
                    <span className="mt-4 md:mt-4 inline-block">
                        Currently pursuing{" "}
                        <SlapTag delay={0.9} rotate={-2} className="bg-brutal-yellow text-black px-3 py-1.5 border-2 border-black dark:border-gray-700 font-bold brutal-interactive mx-2 my-1 md:my-0">MIT @ Monash University</SlapTag>.
                    </span>
                </motion.p>

                {/* CTA Buttons */}
                <motion.div variants={heroButtonsContainerVariants} className="flex flex-wrap gap-6 mt-4 hero-buttons">
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/projects" className="block">
                            <BrutalButton variant="primary" size="lg" className="flex items-center gap-2">
                                View Projects <ArrowRight className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/daily" className="block">
                            <BrutalButton variant="cyan" size="lg" className="flex items-center gap-2">
                                My Daily Life <Sparkles className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                    <motion.div variants={heroButtonVariants}>
                        <Link to="/components" className="w-full sm:w-auto block">
                            <BrutalButton variant="black" size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                                Design System <Palette className="w-5 h-5" />
                            </BrutalButton>
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* ─── About Section ─── */}
            <section className="about-section py-16 md:py-24">
                <motion.h2
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="font-heading text-4xl md:text-5xl font-bold mb-12 cursor-default flex items-center"
                >
                    About Me
                    <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 300, damping: 12, delay: 0.3 }}
                        className="text-brutal-red ml-2 text-6xl leading-[0] origin-bottom inline-block"
                    >
                        <motion.span
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="inline-block"
                        >
                            .
                        </motion.span>
                    </motion.span>
                </motion.h2>

                <motion.div
                    variants={aboutCardsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10"
                >
                    {/* Card 1: Background (Spans 2 cols, 2 rows) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 md:row-span-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="yellow" hoverable className="h-full">
                            <h3 className="font-heading text-3xl font-bold mb-4 flex items-center gap-2">
                                <GraduationCap className="w-8 h-8" /> Education
                            </h3>
                            <div className="text-xl leading-relaxed mt-2 min-h-[90px]">
                                <BlockReveal delay={0.8} boxColor="bg-brutal-yellow">
                                    Master of Information Technology at{" "}
                                    <span className="font-bold underline decoration-4 decoration-black">Monash University</span>.
                                    Passionate about building clean, performant full-stack applications
                                    that push the boundaries of modern web technology.
                                </BlockReveal>
                            </div>
                        </BrutalCard>
                    </motion.div>

                    {/* Card 2: What I Do (Spans 2 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="purple" hoverable className="text-white h-full">
                            <h3 className="font-heading text-2xl font-bold mb-3 flex items-center gap-2">
                                <Zap className="w-6 h-6" /> What I Do
                            </h3>
                            <div className="text-lg leading-relaxed mt-2 min-h-[80px]">
                                <TerminalType
                                    text="Full-stack development with a focus on React ecosystems, .NET backends, and cloud-native deployments."
                                    delay={0.95}
                                    speed={30}
                                    promptColor="text-brutal-yellow"
                                    cursorColor="bg-brutal-yellow"
                                />
                            </div>
                        </BrutalCard>
                    </motion.div>

                    {/* Card 3: Tech Stack (Spans 2 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="cyan" hoverable className="h-full">
                            <h3 className="font-heading text-2xl font-bold mb-3 flex items-center gap-2">
                                <Wrench className="w-6 h-6" /> Tech Stack
                            </h3>
                            <div className="flex flex-wrap gap-3 mt-4">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={skill.label}
                                        initial={{ opacity: 0, scale: 0.5, y: 15 }}
                                        whileInView={{
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            transition: { delay: 1.1 + i * 0.1, type: "spring", stiffness: 400, damping: 12 }
                                        }}
                                        viewport={{ once: true }}
                                        className="inline-block"
                                    >
                                        <BrutalBadge color={skill.color} className="px-4 py-2 text-sm cursor-default">
                                            {skill.label}
                                        </BrutalBadge>
                                    </motion.div>
                                ))}
                            </div>
                        </BrutalCard>
                    </motion.div>

                    {/* Card 4: Philosophy (Spans all 4 cols) */}
                    <motion.div variants={aboutCardVariants} className="md:col-span-4 mt-2 flex flex-col h-full transform-gpu">
                        <BrutalCard color="white" hoverable className="h-full">
                            <h3 className="font-heading text-3xl font-bold mb-5 flex items-center gap-2">
                                <Lightbulb className="w-8 h-8" /> Philosophy
                            </h3>
                            <div className="text-xl leading-relaxed max-w-4xl mt-2 min-h-[90px]">
                                <BlockReveal delay={1.4} boxColor="bg-brutal-yellow">
                                    I believe in <span className="font-bold bg-brutal-yellow text-black px-1 border-2 border-black dark:border-gray-700">shipping fast</span>,
                                    iterating often, and embracing the latest tools. Every project in my portfolio
                                    is a testament to learning by building — not just reading docs.
                                </BlockReveal>
                            </div>
                        </BrutalCard>
                    </motion.div>
                </motion.div>
            </section>
        </div>
    );
}
