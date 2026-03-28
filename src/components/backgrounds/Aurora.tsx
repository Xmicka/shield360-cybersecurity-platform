import type { ReactNode } from "react";

interface AuroraProps {
  colorStops?: string[];
  blend?: string;
  speed?: number;
  children?: ReactNode;
}

export default function Aurora({
  colorStops = ["#10b981", "#7c3aed", "#3b82f6"],
  blend = "mix-blend-screen",
  speed = 0.5,
  children
}: AuroraProps) {
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
          opacity: 0.7;
        }
        @keyframes aurora-float {
          0% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(15vw, -10vh) scale(1.3) rotate(45deg); }
          66% { transform: translate(-15vw, 15vh) scale(0.8) rotate(90deg); }
          100% { transform: translate(5vw, 5vh) scale(1.1) rotate(135deg); }
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
            animationDelay: '0s'
          }} 
        />
        <div 
          className="aurora-blob" 
          style={{ 
            width: '70vw', height: '70vh', 
            bottom: '-10%', right: '-10%', 
            background: "radial-gradient(circle, " + colorStops[1] + " 0%, transparent 60%)",
            animationDuration: (25 / speed) + "s",
            animationDelay: "-" + (10 / speed) + "s"
          }} 
        />
        <div 
          className="aurora-blob" 
          style={{ 
            width: '90vw', height: '60vh', 
            top: '20%', right: '10%', 
            background: "radial-gradient(circle, " + colorStops[2] + " 0%, transparent 60%)",
            animationDuration: (35 / speed) + "s",
            animationDelay: "-" + (15 / speed) + "s"
          }} 
        />
      </div>
      {children ? <div className="relative z-10 w-full h-full pointer-events-auto">{children}</div> : null}
    </div>
  );
}
