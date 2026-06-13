import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export const DrawUnderline = ({ className = "" }: { className?: string }) => (
    <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "circOut", delay: 0.8 }}
        className={`absolute bottom-1 -left-2 w-[110%] h-4 md:h-6 bg-brutal-yellow -z-0 origin-left -rotate-2 ${className}`}
    />
);

export const PopDot = ({ delay = 1.0, className = "" }: { delay?: number, className?: string }) => (
    <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "tween", duration: 0.3, ease: "easeOut", delay }}
        className={`inline-block ${className}`}
    >
        .
    </motion.span>
);

export const SlapTag = ({ children, delay, rotate, className = "" }: { children: React.ReactNode, delay: number, rotate: number, className?: string }) => (
    <motion.span
        initial={{ opacity: 0, scale: 1.2, y: -15, rotate: rotate - 5 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotate }}
        transition={{ type: "spring", stiffness: 350, damping: 20, delay }}
        className={`inline-block ${className}`}
        style={{ transformOrigin: "center" }}
    >
        {children}
    </motion.span>
);

export const BlockReveal = ({ children, boxColor = "bg-brutal-yellow", delay = 0 }: { children: React.ReactNode, boxColor?: string, delay?: number }) => (
    <span className="relative inline-block overflow-hidden py-2 align-bottom">
        <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.01, delay: delay + 0.3 }}
        >
            {children}
        </motion.span>
        <motion.div
            initial={{ left: 0, right: "100%" }}
            whileInView={{
                left: [0, 0, "100%"],
                right: ["100%", 0, 0]
            }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
                ease: "easeInOut",
                delay
            }}
            className={`absolute top-[10%] bottom-[10%] z-10 ${boxColor}`}
        />
    </span>
);

export const StampText = ({ children, delay = 0, angle = -5 }: { children: React.ReactNode, delay?: number, angle?: number }) => (
    <motion.span
        initial={{ opacity: 0, scale: 3, rotate: 0 }}
        animate={{ opacity: 1, scale: 1, rotate: angle }}
        transition={{ type: "spring", stiffness: 300, damping: 15, delay }}
        className="inline-block"
    >
        {children}
    </motion.span>
);

export const TerminalType = ({
    text,
    delay = 0,
    speed = 100,
    promptColor = "text-brutal-red",
    cursorColor = "bg-brutal-black"
}: {
    text: string,
    delay?: number,
    speed?: number,
    promptColor?: string,
    cursorColor?: string
}) => {
    const [displayed, setDisplayed] = useState("");
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;
        let i = 0;
        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayed(text.slice(0, i + 1));
                i++;
                if (i >= text.length) clearInterval(interval);
            }, speed);
            return () => clearInterval(interval);
        }, delay * 1000);
        return () => clearTimeout(startTimeout);
    }, [text, delay, speed, isInView]);

    return (
        <span ref={ref} className="font-mono tracking-tight">
            <span className={`${promptColor} mr-2`}>{">"}</span>
            {displayed}
            <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className={`inline-block w-[0.6em] h-[1em] ${cursorColor} ml-1 align-baseline translate-y-1`}
            />
        </span>
    );
};

// --- CUTTING-EDGE NEW ANIMATIONS ---

export const WavyText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
    const letters = Array.from(text);
    return (
        <motion.span
            className={`inline-flex overflow-hidden ${className}`}
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05, delayChildren: delay }
                }
            }}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span
                    key={index}
                    variants={{
                        hidden: { y: "100%", opacity: 0, rotate: 10 },
                        visible: {
                            y: 0,
                            opacity: 1,
                            rotate: 0,
                            transition: { type: "spring", stiffness: 200, damping: 12 }
                        }
                    }}
                    className="inline-block"
                >
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

export const DecodeText = ({ text, delay = 0, className = "" }: { text: string, delay?: number, className?: string }) => {
    const [displayed, setDisplayed] = useState(text.replace(/./g, "—"));
    const chars = "!<>-_\\\\/[]{}—=+*^?#_(";

    useEffect(() => {
        let iterations = 0;
        const startTimeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayed(prev =>
                    prev.split("")
                        .map((_, index) => {
                            if (index < iterations) return text[index];
                            return chars[Math.floor(Math.random() * chars.length)];
                        })
                        .join("")
                );

                if (iterations >= text.length) clearInterval(interval);
                iterations += 1 / 3; // Slow down decoding
            }, 30);
            return () => clearInterval(interval);
        }, delay * 1000);
        return () => clearTimeout(startTimeout);
    }, [text, delay]);

    return <span className={className}>{displayed}</span>;
};

export const HoverTiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`w-full h-full relative perspective-1000 ${className}`}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
            <div style={{ transform: "translateZ(30px)" }} className="w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};

export const CreativeCardReveal = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => {
    return (
        <motion.div
            className={className}
            initial={{
                opacity: 0,
                rotateX: 45,
                rotateY: -20,
                rotateZ: -5,
                y: 150,
                scale: 0.8,
                filter: "blur(15px) brightness(2)"
            }}
            whileInView={{
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                rotateZ: 0,
                y: 0,
                scale: 1,
                filter: "blur(0px) brightness(1)"
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 12,
                mass: 1.2,
                delay: delay
            }}
            style={{ transformStyle: "preserve-3d", transformOrigin: "bottom center" }}
        >
            {children}
        </motion.div>
    );
};
