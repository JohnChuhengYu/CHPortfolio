import { useState, useEffect } from "react";
import { flushSync } from "react-dom";

export function useTheme() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme) {
                return storedTheme as "light" | "dark";
            }
            if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
                return "dark";
            }
        }
        return "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [theme]);

    const toggleTheme = (event: React.MouseEvent) => {
        // Read current state directly from DOM — single source of truth
        const isDark = document.documentElement.classList.contains("dark");
        const nextTheme = isDark ? "light" : "dark";

        // Fallback for browsers that don't support View Transitions API
        if (!document.startViewTransition) {
            document.documentElement.classList.toggle("dark", !isDark);
            localStorage.setItem("theme", nextTheme);
            setTheme(nextTheme);
            return;
        }

        const x = event.clientX;
        const y = event.clientY;
        const endRadius = Math.hypot(
            Math.max(x, innerWidth - x),
            Math.max(y, innerHeight - y)
        );

        // The transition callback does a synchronous DOM class toggle and React state update.
        // This ensures the new view transition snapshot captures the updated React state (like the new icon).
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(nextTheme);
            });
            document.documentElement.classList.toggle("dark", !isDark);
            localStorage.setItem("theme", nextTheme);
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
            ];

            document.documentElement.animate(
                {
                    clipPath: isDark ? [...clipPath].reverse() : clipPath,
                },
                {
                    duration: 400,
                    easing: "ease-in-out",
                    fill: "forwards",
                    pseudoElement: isDark
                        ? "::view-transition-old(root)"
                        : "::view-transition-new(root)",
                }
            );
        });
    };

    return { theme, toggleTheme };
}
