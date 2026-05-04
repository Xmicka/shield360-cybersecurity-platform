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
