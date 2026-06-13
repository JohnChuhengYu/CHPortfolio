import { type ButtonHTMLAttributes, forwardRef } from "react";

type BrutalButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "cyan" | "black";
type BrutalButtonSize = "sm" | "md" | "lg";

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: BrutalButtonVariant;
    size?: BrutalButtonSize;
}

const variantStyles: Record<BrutalButtonVariant, string> = {
    primary: "bg-brutal-yellow text-black",
    secondary: "bg-brutal-purple text-white",
    danger: "bg-brutal-red text-white",
    cyan: "bg-brutal-cyan text-black",
    ghost: "bg-transparent text-current",
    black: "bg-gray-800 text-white dark:bg-gray-700",
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
