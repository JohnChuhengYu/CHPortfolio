import React, { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";

interface ThemeContextType {
    theme: "light" | "dark";
    toggleTheme: (event?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const isTransitioningRef = useRef(false);

    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (typeof window !== "undefined") {
            const storedTheme = localStorage.getItem("theme");
            if (storedTheme === "light" || storedTheme === "dark") {
                return storedTheme;
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

    const toggleTheme = (event?: React.MouseEvent) => {
        // Prevent rapid mashing or overlapping transitions while an animation is already in progress
        if (isTransitioningRef.current) return;

        const isDark = document.documentElement.classList.contains("dark");
        const nextTheme: "light" | "dark" = isDark ? "light" : "dark";

        // Fallback for browsers that don't support View Transitions or if reduced motion is requested
        const prefersReducedMotion = typeof window !== "undefined" && 
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        const applyThemeChange = () => {
            document.documentElement.classList.toggle("dark", nextTheme === "dark");
            localStorage.setItem("theme", nextTheme);
            setTheme(nextTheme);
        };

        if (typeof document === "undefined" || !document.startViewTransition || prefersReducedMotion) {
            applyThemeChange();
            return;
        }

        isTransitioningRef.current = true;

        // Calculate click origin with robust fallbacks
        let x = event?.clientX;
        let y = event?.clientY;

        if ((x === undefined || y === undefined || (x === 0 && y === 0)) && event?.currentTarget) {
            const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        const originX = x ?? window.innerWidth / 2;
        const originY = y ?? window.innerHeight / 2;

        const endRadius = Math.hypot(
            Math.max(originX, window.innerWidth - originX),
            Math.max(originY, window.innerHeight - originY)
        );

        let transition: any;
        try {
            transition = document.startViewTransition(() => {
                applyThemeChange();
            });
        } catch {
            applyThemeChange();
            isTransitioningRef.current = false;
            return;
        }

        // Safety unlock in case animation is aborted or backgrounded
        const safetyTimer = setTimeout(() => {
            isTransitioningRef.current = false;
        }, 1000);

        transition.ready.then(() => {
            const duration = 600; // Pacing for smooth transition
            const easing = "cubic-bezier(0.25, 1, 0.5, 1)";

            const animation = document.documentElement.animate(
                {
                    clipPath: isDark
                        ? [
                            `circle(${endRadius}px at ${originX}px ${originY}px)`,
                            `circle(0px at ${originX}px ${originY}px)`,
                          ]
                        : [
                            `circle(0px at ${originX}px ${originY}px)`,
                            `circle(${endRadius}px at ${originX}px ${originY}px)`,
                          ],
                },
                {
                    duration,
                    easing,
                    fill: "forwards",
                    pseudoElement: isDark ? "::view-transition-old(root)" : "::view-transition-new(root)",
                }
            );
            return animation.finished;
        }).catch((err: any) => {
            console.error("View transition error:", err);
        }).finally(() => {
            clearTimeout(safetyTimer);
            isTransitioningRef.current = false;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        // Fallback for isolated usage outside provider
        const isDark = typeof document !== "undefined" && document.documentElement.classList.contains("dark");
        return {
            theme: isDark ? "dark" as const : "light" as const,
            toggleTheme: () => {}
        };
    }
    return context;
}
