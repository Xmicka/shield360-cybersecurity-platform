import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ScrollRevealProps {
    children: ReactNode;
    delay?: 0 | 1 | 2 | 3 | 4;
    className?: string;
    threshold?: number;
}

export default function ScrollReveal({
    children,
    delay = 0,
    className = "",
    threshold = 0.15,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect OS-level reduced-motion preference: show immediately,
        // skip observer entirely so there's no scroll-tied jank.
        const prefersReduced =
            typeof window !== "undefined" &&
            window.matchMedia &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) {
            setVisible(true);
            return;
        }

        // Fallback for environments without IntersectionObserver — show now.
        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold, rootMargin: "0px 0px -60px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    const delayClass = delay > 0 ? `scroll-reveal-delay-${delay}` : "";

    return (
        <div
            ref={ref}
            className={`scroll-reveal ${delayClass} ${visible ? "visible" : ""} ${className}`.trim()}
        >
            {children}
        </div>
    );
}
