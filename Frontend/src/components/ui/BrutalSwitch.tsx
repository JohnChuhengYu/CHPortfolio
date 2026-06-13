import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BrutalSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label?: string;
    color?: "yellow" | "purple" | "cyan" | "pink" | "green" | "lime" | "indigo" | "rose" | "amber" | "emerald" | "fuchsia" | "violet" | "sky" | "gray";
}

const switchColorStyles: Record<string, string> = {
    yellow: "bg-brutal-yellow",
    purple: "bg-brutal-purple",
    cyan: "bg-brutal-cyan",
    pink: "bg-brutal-pink",
    green: "bg-brutal-green",
    lime: "bg-brutal-lime",
    indigo: "bg-brutal-indigo",
    rose: "bg-brutal-rose",
    amber: "bg-brutal-amber",
    emerald: "bg-brutal-emerald",
    fuchsia: "bg-brutal-fuchsia",
    violet: "bg-brutal-violet",
    sky: "bg-brutal-sky",
    gray: "bg-gray-500",
};

export const BrutalSwitch = forwardRef<HTMLInputElement, BrutalSwitchProps>(
    ({ checked, onCheckedChange, label, color = "cyan", className, disabled, ...props }, ref) => {
        return (
            <label className={cn("inline-flex items-center gap-4 cursor-pointer", disabled && "opacity-50 cursor-not-allowed", className)}>
                {label && <span className="font-heading font-bold select-none">{label}</span>}
                <div className="relative inline-flex items-center">
                    <input
                        type="checkbox"
                        ref={ref}
                        className="sr-only peer"
                        checked={checked}
                        onChange={(e) => onCheckedChange(e.target.checked)}
                        disabled={disabled}
                        {...props}
                    />
                    <div className={cn(
                        "w-14 h-8 bg-gray-200 dark:bg-gray-700 border-4 border-black dark:border-gray-600 rounded-full transition-colors duration-200",
                        checked && switchColorStyles[color]
                    )} />
                    <div className={cn(
                        "absolute left-1 top-1 w-6 h-6 bg-white dark:bg-gray-200 border-4 border-black dark:border-gray-600 rounded-full transition-all duration-200 z-10",
                        checked && "translate-x-6"
                    )} />
                </div>
            </label>
        );
    }
);

BrutalSwitch.displayName = "BrutalSwitch";
