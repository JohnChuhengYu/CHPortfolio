import { type ButtonHTMLAttributes, forwardRef } from "react";

type BrutalButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "cyan" | "black";
type BrutalButtonSize = "sm" | "md" | "lg";

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: BrutalButtonVariant;
    size?: BrutalButtonSize;
}

const variantStyles: Record<BrutalButtonVariant, string> = {
    primary: "bg-brutal-yellow text-black hover:brightness-105",
    secondary: "bg-brutal-purple text-white hover:brightness-105",
    danger: "bg-brutal-red text-white hover:brightness-105",
    cyan: "bg-brutal-cyan text-black hover:brightness-105",
    ghost: "bg-transparent text-current hover:bg-black/10 dark:hover:bg-white/10",
    black: "bg-black text-white hover:bg-gray-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-gray-600",
};

const sizeStyles: Record<BrutalButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg",
};

export const BrutalButton = forwardRef<HTMLButtonElement, BrutalButtonProps>(
    ({ variant = "primary", size = "md", className = "", children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled}
                className={[
                    // Base
                    "font-heading font-bold border-3 border-black dark:border-gray-700 cursor-pointer",
                    "brutal-shadow brutal-interactive",
                    "select-none inline-flex items-center justify-center gap-2",
                    // Variant
                    variantStyles[variant],
                    // Size
                    sizeStyles[size],
                    // Disabled
                    disabled && "opacity-50 cursor-not-allowed !transform-none !shadow-none",
                    className,
                ].filter(Boolean).join(" ")}
                {...props}
            >
                {children}
            </button>
        );
    }
);

BrutalButton.displayName = "BrutalButton";
