import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type BrutalBadgeColor =
    | "yellow" | "purple" | "cyan" | "red" | "pink" | "blue" | "green" | "orange"
    | "lime" | "indigo" | "rose" | "amber" | "emerald" | "fuchsia" | "violet" | "sky";

export interface BrutalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
    color?: BrutalBadgeColor;
}

const badgeColorStyles: Record<BrutalBadgeColor, string> = {
    yellow: "bg-brutal-yellow text-black",
    purple: "bg-brutal-purple text-white",
    cyan: "bg-brutal-cyan text-black",
    red: "bg-brutal-red text-white",
    pink: "bg-brutal-pink text-black",
    blue: "bg-brutal-blue text-black",
    green: "bg-brutal-green text-black",
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

export const BrutalBadge = forwardRef<HTMLSpanElement, BrutalBadgeProps>(
    ({ color = "yellow", className = "", children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    // 基础布局与排版
                    "inline-flex items-center px-6 py-3",
                    "text-xs font-bold font-mono uppercase tracking-wider",

                    // 边框、基础阴影与动画过渡
                    "border-2 border-black dark:border-gray-700 shadow-[4px_4px_0_0_#000] dark:shadow-[4px_4px_0_0_#333]",
                    "transition-all duration-150 ease-out",

                    // Hover态：向左上偏移，阴影加深（悬浮感）
                    "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_0_#000]",

                    // Active态：向右下受压，阴影减小（物理按压感）
                    "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#000] active:duration-75",

                    // 颜色配置
                    badgeColorStyles[color],

                    // 允许外部传入的 className 覆盖内部默认样式（例如修改 padding）
                    className
                )}
                {...props}
            >
                {children}
            </span>
        );
    }
);

BrutalBadge.displayName = "BrutalBadge";
