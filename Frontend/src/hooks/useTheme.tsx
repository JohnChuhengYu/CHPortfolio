import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";

export function useTheme() {
    const isTransitioningRef = useRef(false);

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

    const toggleTheme = (event?: React.MouseEvent) => {
        // Prevent rapid mashing or overlapping transitions while an animation is already in progress
        if (isTransitioningRef.current) return;

        const isDark = document.documentElement.classList.contains("dark");
        const nextTheme = isDark ? "light" : "dark";

        // Fallback for browsers that don't support View Transitions or if reduced motion is requested
        const prefersReducedMotion = typeof window !== "undefined" && 
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!document.startViewTransition || prefersReducedMotion) {
            document.documentElement.classList.toggle("dark", nextTheme === "dark");
            localStorage.setItem("theme", nextTheme);
            setTheme(nextTheme);
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

        // The transition callback does a synchronous DOM class toggle and React state update
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setTheme(nextTheme);
            });
            document.documentElement.classList.toggle("dark", nextTheme === "dark");
            localStorage.setItem("theme", nextTheme);
        });

        transition.ready.then(() => {
            const duration = 700; // Luxurious, smoother pacing as requested
            const easing = "cubic-bezier(0.25, 1, 0.5, 1)";

            if (isDark) {
                // 关闭黑夜模式 (Dark → Light): 收回 (Retract) 黑色幕布至按钮圆心
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(${endRadius}px at ${originX}px ${originY}px)`,
                            `circle(0px at ${originX}px ${originY}px)`,
                        ],
                    },
                    {
                        duration,
                        easing,
                        fill: "forwards",
                        pseudoElement: "::view-transition-old(root)",
                    }
                );
            } else {
                // 开启黑夜模式 (Light → Dark): 展开 (Expand) 黑色幕布至全屏
                document.documentElement.animate(
                    {
                        clipPath: [
                            `circle(0px at ${originX}px ${originY}px)`,
                            `circle(${endRadius}px at ${originX}px ${originY}px)`,
                        ],
                    },
                    {
                        duration,
                        easing,
                        fill: "forwards",
                        pseudoElement: "::view-transition-new(root)",
                    }
                );
            }
        }).catch(() => {
            // If transition ready is cancelled or errors, release the guard
            isTransitioningRef.current = false;
        });

        transition.finished.finally(() => {
            isTransitioningRef.current = false;
        });
    };

    return { theme, toggleTheme };
}
