import { useState } from "react";
import { BrutalCard } from "@/components/ui/BrutalCard";
import { BrutalInput } from "@/components/ui/BrutalInput";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { BrutalBadge, type BrutalBadgeProps } from "@/components/ui/BrutalBadge";
import { BrutalConfirmModal } from "@/components/ui/BrutalConfirmModal";
import { BrutalAlert } from "@/components/ui/BrutalAlert";
import { BrutalAccordion } from "@/components/ui/BrutalAccordion";
import { BrutalSwitch } from "@/components/ui/BrutalSwitch";
import { BrutalProgress } from "@/components/ui/BrutalProgress";

export function AdminComponentsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const [progress, setProgress] = useState(45);

    return (
        <div className="w-full">
            <h1 className="font-heading text-4xl font-black uppercase mb-8">
                Component Library
                <span className="text-brutal-cyan">.</span>
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pb-12">
                {/* ─── Alerts ─── */}
                <BrutalCard color="white" className="xl:col-span-2">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Alerts (`BrutalAlert`)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <BrutalAlert type="info" title="Information">This is an informational message.</BrutalAlert>
                        <BrutalAlert type="success" title="Success">Operation completed successfully.</BrutalAlert>
                        <BrutalAlert type="warning" title="Warning">Please check your inputs carefully.</BrutalAlert>
                        <BrutalAlert type="error" title="Error">A critical failure has occurred.</BrutalAlert>
                    </div>
                </BrutalCard>
                {/* ─── Buttons ─── */}
                <BrutalCard color="white">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Buttons (`BrutalButton`)</h2>
                    <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <BrutalButton variant="primary">Primary</BrutalButton>
                            <BrutalButton variant="secondary">Secondary</BrutalButton>
                            <BrutalButton variant="danger">Danger</BrutalButton>
                            <BrutalButton variant="black">Black Variant</BrutalButton>
                        </div>
                        <div className="border-t-2 border-brutal-border border-dashed pt-4">
                            <h3 className="font-heading font-bold mb-3 text-sm">Disabled States</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <BrutalButton variant="primary" disabled>Primary Disabled</BrutalButton>
                                <BrutalButton variant="secondary" disabled>Secondary Disabled</BrutalButton>
                            </div>
                        </div>
                    </div>
                </BrutalCard>

                {/* ─── Inputs ─── */}
                <BrutalCard color="yellow">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Inputs (`BrutalInput`)</h2>
                    <div className="flex flex-col gap-4">
                        <BrutalInput
                            name="demo-text"
                            label="Standard Text Input"
                            placeholder="Enter your name..."
                        />
                        <BrutalInput
                            name="demo-password"
                            label="Password Input"
                            type="password"
                            placeholder="*************"
                        />
                        <BrutalInput
                            name="demo-disabled"
                            label="Disabled Input (Currently inputs don't specifically style disabled, but standard HTML works)"
                            disabled
                            placeholder="You cannot type here..."
                        />
                    </div>
                </BrutalCard>

                {/* ─── Badges ─── */}
                <BrutalCard color="cyan">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Badges (`BrutalBadge`)</h2>
                    <div className="flex flex-wrap gap-3 items-center">
                        <BrutalBadge color="yellow">Yellow</BrutalBadge>
                        <BrutalBadge color="cyan">Cyan</BrutalBadge>
                        <BrutalBadge color="purple">Purple</BrutalBadge>
                        <BrutalBadge color="blue">Blue</BrutalBadge>
                        <BrutalBadge color="lime">Lime</BrutalBadge>
                        <BrutalBadge color="indigo">Indigo</BrutalBadge>
                        <BrutalBadge color="rose">Rose</BrutalBadge>
                        <BrutalBadge color="amber">Amber</BrutalBadge>
                        <BrutalBadge color="emerald">Emerald</BrutalBadge>
                        <BrutalBadge color="fuchsia">Fuchsia</BrutalBadge>
                        <BrutalBadge color="violet">Violet</BrutalBadge>
                        <BrutalBadge color="sky">Sky</BrutalBadge>

                        {/* Demo dynamic mapping */}
                        {['v1.0.4', 'STABLE', 'PRODUCTION'].map((tag, i) => {
                            const colors: BrutalBadgeProps['color'][] = ['yellow', 'cyan', 'purple'];
                            return (
                                <BrutalBadge key={tag} color={colors[i % colors.length]}>
                                    {tag}
                                </BrutalBadge>
                            );
                        })}
                    </div>
                </BrutalCard>

                {/* ─── Cards ─── */}
                <BrutalCard color="purple">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2 text-white">Cards (`BrutalCard`)</h2>
                    <div className="flex flex-col gap-4">
                        <BrutalCard color="white" className="p-4">
                            <p className="font-bold">White Card nested in Purple Card</p>
                        </BrutalCard>
                        <div className="grid grid-cols-4 gap-3">
                            <BrutalCard color="yellow" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Yellow</p></BrutalCard>
                            <BrutalCard color="cyan" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Cyan</p></BrutalCard>
                            <BrutalCard color="lime" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Lime</p></BrutalCard>
                            <BrutalCard color="rose" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Rose</p></BrutalCard>
                            <BrutalCard color="indigo" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Indigo</p></BrutalCard>
                            <BrutalCard color="emerald" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Emerald</p></BrutalCard>
                            <BrutalCard color="fuchsia" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Fuchsia</p></BrutalCard>
                            <BrutalCard color="sky" noPadding className="p-4 flex items-center justify-center"><p className="font-heading font-black text-[10px] uppercase">Sky</p></BrutalCard>
                        </div>
                    </div>
                </BrutalCard>

                {/* ─── Switches & Progress ─── */}
                <BrutalCard color="white">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Feedback & Controls</h2>
                    <div className="flex flex-col gap-8">
                        <div>
                            <h3 className="font-heading font-bold mb-4 text-sm">Switches (`BrutalSwitch`)</h3>
                            <div className="flex flex-col gap-4">
                                <BrutalSwitch
                                    checked={isSwitchOn}
                                    onCheckedChange={setIsSwitchOn}
                                    label="Toggle Super Power"
                                    color="pink"
                                />
                                <BrutalSwitch
                                    checked={true}
                                    onCheckedChange={() => { }}
                                    label="Disabled Switch"
                                    color="gray"
                                    disabled
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-heading font-bold mb-4 text-sm mt-4">Progress (`BrutalProgress`)</h3>
                            <div className="flex flex-col gap-4">
                                <BrutalProgress value={progress} showLabel color="cyan" />
                                <BrutalProgress value={100} showLabel color="green" />
                                <BrutalProgress value={85} showLabel color="indigo" />
                                <BrutalProgress value={70} showLabel color="rose" />
                                <BrutalProgress value={55} showLabel color="lime" />
                                <BrutalProgress value={15} color="red" />
                                <BrutalButton variant="ghost" className="mt-2 text-xs py-1" onClick={() => setProgress(p => (p + 15) % 115)}>Advance Progress</BrutalButton>
                            </div>
                        </div>
                    </div>
                </BrutalCard>

                {/* ─── Accordions ─── */}
                <BrutalCard color="yellow">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Accordions (`BrutalAccordion`)</h2>
                    <BrutalAccordion
                        defaultExpandedId="item-1"
                        items={[
                            { id: "item-1", title: "What is Neo-Brutalism?", content: "It is a design style characterized by bold colors, hard shadows, thick borders, and unabashed typography." },
                            { id: "item-2", title: "How to use this?", content: "Simply import BrutalAccordion and pass an array of items containing id, title, and content." },
                        ]}
                    />
                </BrutalCard>

                {/* ─── Modals ─── */}
                <BrutalCard color="white" className="xl:col-span-2">
                    <h2 className="font-heading text-2xl font-bold mb-6 border-b-4 border-brutal-border pb-2">Modals (`BrutalConfirmModal`)</h2>
                    <div className="flex flex-col items-center justify-center p-8 border-4 border-brutal-border bg-brutal-bg brutal-shadow-sm">
                        <p className="font-mono text-sm mb-6 text-center max-w-lg text-brutal-black">
                            Modals use a fixed `z-50` overlay to obscure the screen completely. It takes a title, a message, and two callbacks (`onConfirm`, `onCancel`).
                        </p>
                        <BrutalButton
                            variant="primary"
                            onClick={() => setIsModalOpen(true)}
                        >
                            Trigger Demo Modal
                        </BrutalButton>
                    </div>

                    <BrutalConfirmModal
                        isOpen={isModalOpen}
                        title="DANGEROUS ACTION!"
                        message="Are you sure you want to trigger this demo modal? This action only closes the modal, but it looks extremely intimidating!"
                        confirmText="YES, DO IT!"
                        cancelText="NEVERMIND"
                        onConfirm={() => setIsModalOpen(false)}
                        onCancel={() => setIsModalOpen(false)}
                    />
                </BrutalCard>
            </div>
        </div>
    );
}
