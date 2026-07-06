import React, { useEffect, useRef } from 'react';

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    const numStars = 150;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse interactive coordinates
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    // Initialize stars
    const initStars = () => {
      stars = [];
      for (let i = 0; i < numStars; i++) {
        // Position relative to center
        const radius = Math.random() * Math.max(width, height) * 0.8;
        const angle = Math.random() * Math.PI * 2;
        stars.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          size: Math.random() * 1.5 + 0.5,
          color: getRandomColor(),
          // Speed of individual rotation (varying speeds create depth)
          speed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1) * 0.05,
          // Depth factor for parallax
          z: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const getRandomColor = () => {
      const colors = [
        'rgba(255, 255, 255, ',     // white
        'rgba(147, 197, 253, ',     // light blue (slate-300 / blue-300)
        'rgba(196, 181, 253, ',     // light violet
        'rgba(165, 243, 252, ',     // light cyan
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    initStars();

    // Loop
    const animate = () => {
      // Reset shadow blur to prevent the clear rect from drawing with a glow
      ctx.shadowBlur = 0;
      // Clear canvas with a slightly transparent dark background to create a tail/motion blur effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)'; // bg-slate-950 color
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse position damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw and update stars
      stars.forEach((star) => {
        // Rotate star coordinates around center (0,0)
        const cos = Math.cos(star.speed);
        const sin = Math.sin(star.speed);
        const rx = star.x * cos - star.y * sin;
        const ry = star.x * sin + star.y * cos;

        star.x = rx;
        star.y = ry;

        // Perspective projection & Parallax offset using mouse position
        // Center + rotated position + mouse offset proportional to star's depth (z)
        const offsetX = (mouse.x - width / 2) * (1 - star.z) * 0.25;
        const offsetY = (mouse.y - height / 2) * (1 - star.z) * 0.25;
        
        const px = rx + width / 2 + offsetX;
        const py = ry + height / 2 + offsetY;

        // Fade in/out if stars are near borders
        let opacity = 1;
        const borderPadding = 50;
        if (px < borderPadding || px > width - borderPadding || py < borderPadding || py > height - borderPadding) {
          opacity = Math.max(0, Math.min(1, Math.min(px, width - px, py, height - py) / borderPadding));
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(px, py, star.size * star.z * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `${star.color}${opacity * star.z})`;
        ctx.shadowBlur = star.size > 1.5 ? 4 : 0;
        ctx.shadowColor = '#6366f1';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full block pointer-events-none"
      style={{ background: '#020617' }}
    />
  );
}
