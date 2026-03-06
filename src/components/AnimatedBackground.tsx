import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimatedBackground() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // --- Particles with connecting lines (mesh network) ---
        const particleCount = 400;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities: number[] = [];

        const cyan = new THREE.Color(0x00f0ff);
        const purple = new THREE.Color(0x7c3aed);
        const rose = new THREE.Color(0xf43f5e);
        const palette = [cyan, purple, rose];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
            velocities.push(
                (Math.random() - 0.5) * 0.008,
                (Math.random() - 0.5) * 0.008,
                (Math.random() - 0.5) * 0.005
            );

            const color = palette[Math.floor(Math.random() * palette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.12,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // --- Connecting lines (mesh network) ---
        const lineMaxDist = 4.5;
        const maxLines = 600;
        const linePositions = new Float32Array(maxLines * 6);
        const lineColors = new Float32Array(maxLines * 6);
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);

        // --- Shield wireframe (pulsing) ---
        const shieldGeo = new THREE.IcosahedronGeometry(3.5, 1);
        const shieldMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            wireframe: true,
            transparent: true,
            opacity: 0.04,
        });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        scene.add(shield);

        // --- Orbiting rings ---
        const ringGeo = new THREE.RingGeometry(6, 6.08, 80);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.06, side: THREE.DoubleSide });
        const ring1 = new THREE.Mesh(ringGeo, ringMat);
        ring1.rotation.x = Math.PI / 3;
        scene.add(ring1);

        const ring2Geo = new THREE.RingGeometry(8, 8.06, 80);
        const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.04, side: THREE.DoubleSide });
        const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
        ring2.rotation.x = -Math.PI / 4;
        ring2.rotation.y = Math.PI / 5;
        scene.add(ring2);

        camera.position.z = 18;

        // Events
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", handleMouseMove);

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener("resize", handleResize);

        let animationId: number;
        const posArray = particleGeometry.attributes.position.array as Float32Array;
        const linePosArray = lineGeometry.attributes.position.array as Float32Array;
        const lineColArray = lineGeometry.attributes.color.array as Float32Array;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Move particles
            for (let i = 0; i < particleCount; i++) {
                posArray[i * 3] += velocities[i * 3];
                posArray[i * 3 + 1] += velocities[i * 3 + 1];
                posArray[i * 3 + 2] += velocities[i * 3 + 2];

                // Wrap around
                for (let j = 0; j < 3; j++) {
                    const limit = j === 2 ? 15 : 20;
                    if (posArray[i * 3 + j] > limit) posArray[i * 3 + j] = -limit;
                    if (posArray[i * 3 + j] < -limit) posArray[i * 3 + j] = limit;
                }
            }
            particleGeometry.attributes.position.needsUpdate = true;

            // Update connecting lines
            let lineIdx = 0;
            for (let i = 0; i < particleCount && lineIdx < maxLines; i++) {
                for (let j = i + 1; j < particleCount && lineIdx < maxLines; j++) {
                    const dx = posArray[i * 3] - posArray[j * 3];
                    const dy = posArray[i * 3 + 1] - posArray[j * 3 + 1];
                    const dz = posArray[i * 3 + 2] - posArray[j * 3 + 2];
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                    if (dist < lineMaxDist) {
                        const alpha = 1 - dist / lineMaxDist;
                        linePosArray[lineIdx * 6] = posArray[i * 3];
                        linePosArray[lineIdx * 6 + 1] = posArray[i * 3 + 1];
                        linePosArray[lineIdx * 6 + 2] = posArray[i * 3 + 2];
                        linePosArray[lineIdx * 6 + 3] = posArray[j * 3];
                        linePosArray[lineIdx * 6 + 4] = posArray[j * 3 + 1];
                        linePosArray[lineIdx * 6 + 5] = posArray[j * 3 + 2];
                        // Cyan line color with distance-based alpha
                        lineColArray[lineIdx * 6] = 0;
                        lineColArray[lineIdx * 6 + 1] = 0.94 * alpha;
                        lineColArray[lineIdx * 6 + 2] = 1 * alpha;
                        lineColArray[lineIdx * 6 + 3] = 0;
                        lineColArray[lineIdx * 6 + 4] = 0.94 * alpha;
                        lineColArray[lineIdx * 6 + 5] = 1 * alpha;
                        lineIdx++;
                    }
                }
            }
            // Clear remaining lines
            for (let i = lineIdx; i < maxLines; i++) {
                for (let j = 0; j < 6; j++) { linePosArray[i * 6 + j] = 0; lineColArray[i * 6 + j] = 0; }
            }
            lineGeometry.attributes.position.needsUpdate = true;
            lineGeometry.attributes.color.needsUpdate = true;

            // Rotate elements
            particles.rotation.y += 0.0003;
            shield.rotation.x += 0.001;
            shield.rotation.y += 0.002;
            ring1.rotation.z += 0.0008;
            ring2.rotation.z -= 0.0005;

            // Shield pulse
            const pulse = 0.03 + Math.sin(Date.now() * 0.001) * 0.02;
            shieldMat.opacity = pulse;

            // Mouse parallax
            camera.position.x += (mouseRef.current.x * 3 - camera.position.x) * 0.02;
            camera.position.y += (-mouseRef.current.y * 3 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
            particleGeometry.dispose();
            particleMaterial.dispose();
            lineGeometry.dispose();
            lineMaterial.dispose();
            shieldGeo.dispose();
            shieldMat.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            ring2Geo.dispose();
            ring2Mat.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-0 pointer-events-none"
            style={{
                background:
                    "radial-gradient(ellipse at 30% 20%, rgba(0, 240, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(124, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(244, 63, 94, 0.02) 0%, transparent 40%)",
            }}
        />
    );
}
