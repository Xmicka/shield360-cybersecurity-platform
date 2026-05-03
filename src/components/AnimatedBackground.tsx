/**
 * Animated Background with Wisprflow Aesthetic
 * - Floating gradient blobs with soft animations
 * - CSS-based for performance
 * - NO THREE.js (replaced with simple divs)
 */

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      {/* Lavender blob - top right */}
      <div
        className="floating"
        style={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 300,
          height: 300,
          background: 'radial-gradient(circle, rgba(212, 197, 240, 0.3) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animationDelay: '0s',
        }}
      />

      {/* Sage blob - bottom left */}
      <div
        className="floating-delayed"
        style={{
          position: 'absolute',
          bottom: -150,
          left: -100,
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(61, 90, 71, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          animationDelay: '2s',
        }}
      />

      {/* Coral blob - center */}
      <div
        className="floating-delayed-lg"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 250,
          height: 250,
          background: 'radial-gradient(circle, rgba(232, 145, 122, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          animationDelay: '4s',
        }}
      />

      {/* Gold accent blob - top left */}
      <div
        className="floating"
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: 200,
          height: 200,
          background: 'radial-gradient(circle, rgba(212, 168, 83, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          animationDelay: '1s',
        }}
      />
    </div>
  );
}
