import { useState, type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
}

interface BrutalAccordionProps extends HTMLAttributes<HTMLDivElement> {
    items: AccordionItem[];
    defaultExpandedId?: string;
    allowMultiple?: boolean;
}

export const BrutalAccordion = forwardRef<HTMLDivElement, BrutalAccordionProps>(
    ({ items, defaultExpandedId, allowMultiple = false, className, ...props }, ref) => {
        const [expandedState, setExpandedState] = useState<Record<string, boolean>>(
            defaultExpandedId ? { [defaultExpandedId]: true } : {}
        );

        const toggleItem = (id: string) => {
            setExpandedState((prev) => {
                const isCurrentlyExpanded = prev[id];
                if (allowMultiple) {
                    return { ...prev, [id]: !isCurrentlyExpanded };
                }
                // Single exclusion mode
                return isCurrentlyExpanded ? {} : { [id]: true };
            });
        };

        return (
            <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props}>
                {items.map((item) => {
                    const isExpanded = !!expandedState[item.id];
                    return (
                        <div key={item.id} className="border-4 border-black dark:border-gray-700 brutal-shadow bg-brutal-white">
                            <button
                                type="button"
                                onClick={() => toggleItem(item.id)}
                                className={cn(
                                    "w-full flex items-center justify-between p-4 font-heading font-bold text-lg transition-colors hover:bg-brutal-yellow hover:text-black focus:outline-none text-brutal-black",
                                    isExpanded && "border-b-4 border-black dark:border-gray-700 bg-brutal-cyan text-black hover:bg-brutal-cyan hover:text-black"
                                )}
                            >
                                <span className="text-left">{item.title}</span>
                                <ChevronDown
                                    className={cn("w-6 h-6 transition-transform duration-200", isExpanded && "rotate-180")}
                                    strokeWidth={3}
                                />
                            </button>
                            {isExpanded && (
                                <div className="p-4 bg-transparent text-brutal-black text-base font-medium animate-fade-in origin-top">
                                    {item.content}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }
);

BrutalAccordion.displayName = "BrutalAccordion";
