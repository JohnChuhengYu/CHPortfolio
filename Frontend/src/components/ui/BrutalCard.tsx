import { type HTMLAttributes, forwardRef } from "react";

interface BrutalCardProps extends HTMLAttributes<HTMLDivElement> {
    color?: "white" | "yellow" | "purple" | "cyan" | "red" | "pink" | "blue" | "orange" | "lime" | "indigo" | "rose" | "amber" | "emerald" | "fuchsia" | "violet" | "sky";
    hoverable?: boolean;
    noPadding?: boolean;
}

const colorStyles: Record<NonNullable<BrutalCardProps["color"]>, string> = {
    white: "bg-brutal-white text-brutal-black",
    yellow: "bg-brutal-yellow text-black",
    purple: "bg-brutal-purple text-white",
    cyan: "bg-brutal-cyan text-black",
    red: "bg-brutal-red text-white",
    pink: "bg-brutal-pink text-black",
    blue: "bg-brutal-blue text-black",
    orange: "bg-brutal-orange text-black",
    lime: "bg-brutal-lime text-black",
    indigo: "bg-brutal-indigo text-white",
    rose: "bg-brutal-rose text-white",
    amber: "bg-brutal-amber text-black",
    emerald: "bg-brutal-emerald text-white",
    fuchsia: "bg-brutal-fuchsia text-white",
    violet: "bg-brutal-violet text-white",
    sky: "bg-brutal-sky text-black",
};

export const BrutalCard = forwardRef<HTMLDivElement, BrutalCardProps>(
    ({ color = "white", hoverable = false, noPadding = false, className = "", children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={[
                    // Base - Thinner border
                    "border-2 border-black dark:border-gray-700 brutal-shadow",
                    // Color
                    colorStyles[color],
                    // Padding - Increased for breathing room
                    !noPadding && "p-8 md:p-10",
                    // Hover
                    hoverable && "brutal-interactive cursor-pointer",
                    className,
                ].filter(Boolean).join(" ")}
                {...props}
            >
                {children}
            </div>
        );
    }
);

BrutalCard.displayName = "BrutalCard";
