import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { BrutalInput } from "@/components/ui/BrutalInput";
import { BrutalProgress } from "@/components/ui/BrutalProgress";
import { BrutalAlert } from "@/components/ui/BrutalAlert";
import { BrutalSwitch } from "@/components/ui/BrutalSwitch";
import { BrutalAccordion } from "@/components/ui/BrutalAccordion";
import {
    DecodeText, HoverTiltCard, CreativeCardReveal,
    TerminalType, StampText, WavyText,
    BlockReveal, PopDot, DrawUnderline, SlapTag
} from "@/components/ui/MotionEffects";
import { useState } from "react";
import { motion } from "framer-motion";

export function PublicComponentsPage() {
    const [progress, setProgress] = useState(85);
    const [autoMode, setAutoMode] = useState(true);
    return (
        <div className="w-full px-6 py-12 md:py-20 max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-20 text-center max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <BrutalBadge color="purple" className="mb-6 px-6 py-3 text-lg">
                        Design System
                    </BrutalBadge>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                    className="font-heading text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-[1.1] inline-block relative"
                >
                    <DecodeText text="Neo-Brutalism" delay={0.2} />
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brutal-purple via-brutal-pink to-brutal-cyan relative z-10" style={{ WebkitTextStroke: '2px black' }}>
                        <DecodeText text="UI Kit" delay={0.8} />
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="font-heading text-xl md:text-2xl mt-8 leading-relaxed"
                >
                    A collection of raw, high-contrast, strictly uncompromising React components built for maximum visual impact.
                </motion.p>
            </header>

            {/* Showcase Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* ─── Typography & Colors ─── */}
                <CreativeCardReveal className="lg:col-span-12" delay={0}>
                    <HoverTiltCard>
                        <BrutalCard color="white" className="p-8 md:p-12 border-4 h-full">
                            <div className="flex flex-col md:flex-row gap-12 items-center justify-between">
                                <div className="flex-1">
                                    <h2 className="font-heading text-4xl font-bold mb-4">Unapologetic Colors</h2>
                                    <p className="text-lg">Solid backgrounds. Thick black borders. Zero drop-shadow blur.</p>
                                </div>
                                <div className="flex gap-3 flex-wrap flex-1 justify-end">
                                    {['yellow', 'cyan', 'pink', 'purple', 'red', 'orange', 'lime', 'indigo', 'rose', 'amber', 'emerald', 'fuchsia', 'violet', 'sky'].map((color) => (
                                        <div key={color} className={`w-12 h-12 md:w-20 md:h-20 bg-brutal-${color} border-4 border-black brutal-shadow transition-transform hover:-translate-y-2`} title={color} />
                                    ))}
                                </div>
                            </div>
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>

                {/* ─── Buttons ─── */}
                <CreativeCardReveal className="lg:col-span-7" delay={0.1}>
                    <HoverTiltCard>
                        <BrutalCard color="yellow" className="h-full p-8 md:p-12">
                            <h2 className="font-heading text-4xl font-black mb-8">Buttons</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex flex-col gap-4">
                                    <BrutalButton variant="primary" size="lg">Action Primary</BrutalButton>
                                    <BrutalButton variant="cyan" size="lg">Action Cyan</BrutalButton>
                                    <BrutalButton variant="secondary" size="lg">Action Purple</BrutalButton>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <BrutalButton variant="danger" size="lg">Danger Zone</BrutalButton>
                                    <BrutalButton variant="black" size="lg">Dark Mode</BrutalButton>
                                    <BrutalButton variant="ghost" size="lg" className="border-dashed">Ghost Outline</BrutalButton>
                                </div>
                            </div>
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>

                {/* ─── Forms / Inputs ─── */}
                <CreativeCardReveal className="lg:col-span-5" delay={0.2}>
                    <HoverTiltCard>
                        <BrutalCard color="cyan" className="h-full p-8 md:p-12">
                            <h2 className="font-heading text-4xl font-black mb-8">Inputs</h2>
                            <form className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
                                <BrutalInput
                                    name="showcase-email"
                                    label="EMAIL ADDRESS"
                                    placeholder="neo@matrix.com"
                                />
                                <div className="flex flex-col gap-2">
                                    <label className="font-heading font-bold text-sm">MESSAGE</label>
                                    <textarea
                                        className="font-heading px-4 py-3 text-lg border-3 border-black bg-white
                                                   brutal-shadow-sm placeholder:text-brutal-muted
                                                   focus:outline-none focus:shadow-[6px_6px_0px_0px_#000]
                                                   transition-shadow duration-150 resize-y min-h-[100px]"
                                        placeholder="Type your message..."
                                    />
                                </div>
                            </form>
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>

                {/* ─── Badges ─── */}
                <CreativeCardReveal className="lg:col-span-12" delay={0.1}>
                    <HoverTiltCard>
                        <BrutalCard color="purple" className="p-8 md:p-12 text-white border-4 h-full">
                            <h2 className="font-heading text-4xl font-black mb-8">Interactive Badges</h2>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <BrutalBadge color="yellow" className="font-heading font-black">#React19</BrutalBadge>
                                <BrutalBadge color="pink" className="font-heading font-black">#Design</BrutalBadge>
                                <BrutalBadge color="cyan" className="font-heading font-black">#Architecture</BrutalBadge>
                                <BrutalBadge color="lime" className="font-heading font-black">#Vibrant</BrutalBadge>
                                <BrutalBadge color="rose" className="font-heading font-black">#Brutal</BrutalBadge>
                                <BrutalBadge color="indigo" className="font-heading font-black">#Modern</BrutalBadge>
                                <BrutalBadge color="sky" className="font-heading font-black">#Clean</BrutalBadge>
                                <BrutalBadge color="emerald" className="font-heading font-black">#Stable</BrutalBadge>
                                <BrutalBadge color="fuchsia" className="font-heading font-black">#Dynamic</BrutalBadge>
                            </div>
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>

                {/* ─── Feedback & Progress ─── */}
                <CreativeCardReveal className="lg:col-span-6" delay={0.1}>
                    <HoverTiltCard>
                        <BrutalCard color="yellow" className="h-full p-8 md:p-12">
                            <h2 className="font-heading text-4xl font-black mb-8">System Feedback</h2>
                            <div className="flex flex-col gap-6">
                                <BrutalAlert type="success" title="System Online">All services operating within normal parameters.</BrutalAlert>
                                <BrutalAlert type="warning" title="API Deprecation">Version 1.0 will be deprecated next month.</BrutalAlert>
                            </div>

                            <h3 className="font-heading text-2xl font-black mt-10 mb-6">Metrics</h3>
                            <div className="flex flex-col gap-4">
                                <BrutalProgress value={progress} color="cyan" showLabel />
                                <BrutalProgress value={65} color="lime" showLabel />
                                <BrutalProgress value={40} color="rose" showLabel />
                                <div className="flex justify-between items-center mt-2">
                                    <BrutalSwitch
                                        checked={autoMode}
                                        onCheckedChange={setAutoMode}
                                        label="Auto Scaling"
                                        color="purple"
                                    />
                                    <BrutalButton variant="black" size="sm" onClick={() => setProgress(p => (p + 20) % 120)}>Test Load</BrutalButton>
                                </div>
                            </div>
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>

                {/* ─── Layouts & Accordions ─── */}
                <CreativeCardReveal className="lg:col-span-6" delay={0.2}>
                    <HoverTiltCard>
                        <BrutalCard color="white" className="h-full p-8 md:p-12 border-4">
                            <h2 className="font-heading text-4xl font-black mb-8">Data Layouts</h2>
                            <BrutalAccordion
                                defaultExpandedId="item-1"
                                items={[
                                    { id: "item-1", title: "Frictionless UX?", content: "In Neo-Brutalism, we prioritize high legibility and unambiguous boundaries over realistic shadows." },
                                    { id: "item-2", title: "Why thick borders?", content: "Black borders ground the components, making it crystal clear where interaction areas begin and end." },
                                    { id: "item-3", title: "Are animations included?", content: "Yes, harsh but responsive micro-interactions (translate, immediate shadow drops) give the UI a very physical 'clicky' feel without being organic." }
                                ]}
                            />
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>

                {/* ─── Motion & Typography ─── */}
                <CreativeCardReveal className="lg:col-span-12" delay={0.3}>
                    <HoverTiltCard>
                        <BrutalCard color="pink" className="h-full p-8 md:p-12 border-4">
                            <h2 className="font-heading text-4xl font-black mb-8">Motion & Typography</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Text Effects */}
                                <div className="flex flex-col gap-6 p-6 border-3 border-black bg-brutal-white text-brutal-black brutal-shadow-sm">
                                    <h3 className="font-heading font-bold text-lg border-b-2 border-black pb-2">Dynamic Text</h3>
                                    <div className="text-2xl font-bold font-heading">
                                        <WavyText text="Wavy Text" />
                                    </div>
                                    <div className="text-2xl font-bold font-heading">
                                        <DecodeText text="Decode Hacker" />
                                    </div>
                                    <div className="text-2xl font-bold font-heading">
                                        <TerminalType text="Terminal Typing" />
                                    </div>
                                    <div className="text-3xl font-bold font-heading">
                                        <StampText>STAMP</StampText>
                                    </div>
                                </div>

                                {/* Element Reveals */}
                                <div className="flex flex-col gap-6 p-6 border-3 border-black bg-brutal-white text-brutal-black brutal-shadow-sm">
                                    <h3 className="font-heading font-bold text-lg border-b-2 border-black pb-2">Element Reveals</h3>
                                    <div className="text-2xl font-bold font-heading inline-block">
                                        <BlockReveal>Block Reveal</BlockReveal>
                                    </div>
                                    <div className="mt-4">
                                        <SlapTag delay={0.2} rotate={-3} className="bg-brutal-yellow text-black px-2 py-1">Slap Tag Entrance</SlapTag>
                                    </div>
                                </div>

                                {/* Accents */}
                                <div className="flex flex-col gap-8 p-6 border-3 border-black bg-brutal-white text-brutal-black brutal-shadow-sm">
                                    <h3 className="font-heading font-bold text-lg border-b-2 border-black pb-2">Accents</h3>
                                    <div className="text-2xl font-bold font-heading relative inline-block w-max">
                                        Draw Underline
                                        <DrawUnderline className="-rotate-2" />
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 text-xl font-bold font-heading">
                                        Pop Dot
                                        <div className="relative w-8 h-8"><PopDot className="text-brutal-red absolute left-0 top-0" /></div>
                                    </div>
                                </div>
                            </div>
                        </BrutalCard>
                    </HoverTiltCard>
                </CreativeCardReveal>
            </div>
        </div>
    );
}
