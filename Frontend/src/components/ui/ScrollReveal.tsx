import { useEffect, useRef, useState, type ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    animation?: "slide-up" | "fade-in" | "pop-in";
    delay?: 100 | 150 | 200 | 300 | 400 | 500;
    threshold?: number;
}

export function ScrollReveal({
    children,
    className = "",
    animation = "slide-up",
    delay,
    threshold = 0.1,
}: ScrollRevealProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (ref.current) observer.unobserve(ref.current);
                }
            },
            {
                threshold,
                rootMargin: "0px 0px -50px 0px",
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    const animationClass = isVisible ? `animate-${animation}` : "opacity-0 translate-y-8";

    return (
        <div
            ref={ref}
            className={`${isVisible ? animationClass : "opacity-0"} ${delay ? `delay-${delay}` : ""} ${className}`}
            style={{ willChange: "transform, opacity" }}
        >
            {children}
        </div>
    );
}
