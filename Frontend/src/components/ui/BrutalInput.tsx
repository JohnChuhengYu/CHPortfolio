import { type InputHTMLAttributes, forwardRef } from "react";

interface BrutalInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const BrutalInput = forwardRef<HTMLInputElement, BrutalInputProps>(
    ({ label, className = "", id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-2">
                {label && (
                    <label
                        htmlFor={id}
                        className="font-heading font-bold text-sm"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={[
                        "font-heading px-4 py-2.5 text-base",
                        "border-3 border-black dark:border-gray-700 bg-brutal-white text-brutal-black",
                        "brutal-shadow-sm",
                        "placeholder:text-brutal-muted",
                        "focus:outline-none focus:shadow-[6px_6px_0px_0px_#000] dark:focus:shadow-[6px_6px_0px_0px_#333]",
                        "transition-shadow duration-150",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        className,
                    ].filter(Boolean).join(" ")}
                    {...props}
                />
            </div>
        );
    }
);

BrutalInput.displayName = "BrutalInput";
