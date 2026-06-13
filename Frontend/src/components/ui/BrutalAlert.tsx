import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Info, AlertCircle, CheckCircle2, AlertTriangle, X } from "lucide-react";

type BrutalAlertType = "info" | "success" | "warning" | "error";

interface BrutalAlertProps extends HTMLAttributes<HTMLDivElement> {
    type?: BrutalAlertType;
    title?: string;
    onClose?: () => void;
}

const alertConfig: Record<BrutalAlertType, { bg: string; icon: React.ReactNode }> = {
    info: { bg: "bg-brutal-cyan text-black", icon: <Info className="w-6 h-6" /> },
    success: { bg: "bg-brutal-green text-black", icon: <CheckCircle2 className="w-6 h-6" /> },
    warning: { bg: "bg-brutal-yellow text-black", icon: <AlertTriangle className="w-6 h-6" /> },
    error: { bg: "bg-brutal-red text-white", icon: <AlertCircle className="w-6 h-6" /> },
};

export const BrutalAlert = forwardRef<HTMLDivElement, BrutalAlertProps>(
    ({ type = "info", title, onClose, className, children, ...props }, ref) => {
        const config = alertConfig[type];

        return (
            <div
                ref={ref}
                className={cn(
                    "relative flex items-start gap-4 p-4 border-4 border-black brutal-shadow-sm",
                    config.bg,
                    className
                )}
                {...props}
            >
                <div className="shrink-0 mt-0.5">{config.icon}</div>
                <div className="flex-1">
                    {title && <h5 className="font-heading font-bold text-lg mb-1 leading-none">{title}</h5>}
                    <div className="text-sm font-medium">{children}</div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 border-2 border-transparent hover:border-black transition-colors"
                        aria-label="Close Alert"
                    >
                        <X className="w-5 h-5" strokeWidth={3} />
                    </button>
                )}
            </div>
        );
    }
);

BrutalAlert.displayName = "BrutalAlert";
