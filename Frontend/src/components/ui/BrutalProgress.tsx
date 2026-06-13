import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface BrutalProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
    max?: number;
    color?: "yellow" | "purple" | "cyan" | "pink" | "green" | "red" | "black" | "white" | "lime" | "indigo" | "rose" | "amber" | "emerald" | "fuchsia" | "violet" | "sky";
    showLabel?: boolean;
}

const progressColorStyles: Record<string, string> = {
    yellow: "bg-brutal-yellow text-black",
    purple: "bg-brutal-purple text-white",
    cyan: "bg-brutal-cyan text-black",
    pink: "bg-brutal-pink text-black",
    green: "bg-brutal-green text-black",
    red: "bg-brutal-red text-white",
    black: "bg-black text-white",
    white: "bg-brutal-white text-brutal-black",
    lime: "bg-brutal-lime text-black",
    indigo: "bg-brutal-indigo text-white",
    rose: "bg-brutal-rose text-white",
    amber: "bg-brutal-amber text-black",
    emerald: "bg-brutal-emerald text-white",
    fuchsia: "bg-brutal-fuchsia text-white",
    violet: "bg-brutal-violet text-white",
    sky: "bg-brutal-sky text-black",
};

export const BrutalProgress = forwardRef<HTMLDivElement, BrutalProgressProps>(
    ({ value, max = 100, color = "cyan", showLabel = false, className, ...props }, ref) => {
        // Ensure value is between 0 and max
        const safeValue = Math.min(Math.max(value, 0), max);
        const percentage = Math.round((safeValue / max) * 100);

        return (
            <div
                ref={ref}
                className={cn("w-full h-8 border-4 border-black dark:border-gray-700 bg-brutal-white brutal-shadow-sm relative overflow-hidden", className)}
                role="progressbar"
                aria-valuenow={safeValue}
                aria-valuemin={0}
                aria-valuemax={max}
                {...props}
            >
                <div
                    className={cn(
                        "h-full border-r-4 border-black dark:border-gray-700 transition-all duration-500 ease-out flex items-center justify-end px-2",
                        progressColorStyles[color]
                    )}
                    style={{ width: `${percentage}%` }}
                >
                    {showLabel && percentage > 10 && (
                        <span className="font-heading font-black text-sm">{percentage}%</span>
                    )}
                </div>
                {showLabel && percentage <= 10 && (
                    <span className="absolute inset-y-0 left-4 flex items-center font-heading font-black text-sm z-10 text-brutal-black">
                        {percentage}%
                    </span>
                )}
            </div>
        );
    }
);

BrutalProgress.displayName = "BrutalProgress";
