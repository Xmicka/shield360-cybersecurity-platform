import { useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuroraProps {
  colorStops?: string[];
  blend?: string;
  speed?: number;
  children?: ReactNode;
}

/**
 * Aurora — softly drifting, blurred radial gradients used as a hero/page
 * background. Pure CSS keyframes so we don't pay the cost of a canvas/shader.
 *
 * Performance notes:
 *   - The blobs use `filter: blur(80px)`. We don't animate the filter
 *     itself (only transform), so the blur is a one-time paint cost.
 *   - We pause animations when the tab is hidden via document.visibilityState.
 *   - prefers-reduced-motion is respected via a media query inside the
 *     scoped <style> block.
 */
export default function Aurora({
  colorStops = ["#d4e8f0", "#e8d4f0", "#d4eee0"],
  blend = "mix-blend-multiply",
  speed = 0.5,
  children
}: AuroraProps) {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState === "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const playState = paused ? "paused" : "running";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
        .aurora-container {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          overflow: hidden;
          z-index: 0;
        }
        .aurora-blob {
          position: absolute;
          filter: blur(80px);
          border-radius: 50%;
          animation: aurora-float 20s infinite alternate ease-in-out;
          opacity: 0.55;
          will-change: transform;
        }
        @keyframes aurora-float {
          0%   { transform: translate3d(0, 0, 0) scale(1) rotate(0deg); }
          33%  { transform: translate3d(10vw, -8vh, 0) scale(1.15) rotate(30deg); }
          66%  { transform: translate3d(-10vw, 10vh, 0) scale(0.92) rotate(60deg); }
          100% { transform: translate3d(4vw, 4vh, 0) scale(1.05) rotate(90deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .aurora-blob { animation: none !important; }
        }
      `}</style>

      <div className={"aurora-container " + blend}>
        <div
          className="aurora-blob"
          style={{
            width: '80vw', height: '80vh',
            top: '-20%', left: '-10%',
            background: "radial-gradient(circle, " + colorStops[0] + " 0%, transparent 60%)",
            animationDuration: (30 / speed) + "s",
            animationDelay: '0s',
            animationPlayState: playState
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: '70vw', height: '70vh',
            bottom: '-10%', right: '-10%',
            background: "radial-gradient(circle, " + colorStops[1] + " 0%, transparent 60%)",
            animationDuration: (25 / speed) + "s",
            animationDelay: "-" + (10 / speed) + "s",
            animationPlayState: playState
          }}
        />
        <div
          className="aurora-blob"
          style={{
            width: '90vw', height: '60vh',
            top: '20%', right: '10%',
            background: "radial-gradient(circle, " + colorStops[2] + " 0%, transparent 60%)",
            animationDuration: (35 / speed) + "s",
            animationDelay: "-" + (15 / speed) + "s",
            animationPlayState: playState
          }}
        />
      </div>
      {children ? <div className="relative z-10 w-full h-full pointer-events-auto">{children}</div> : null}
    </div>
  );
}
