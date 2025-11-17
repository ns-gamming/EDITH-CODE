import { useEffect, useRef } from 'react';

export function Fluid3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      opacity: number;
      pulse: number;
      trail: Array<{x: number; y: number; z: number}>;
    }> = [];

    const colors = [
      '#00D9FF',
      '#7B68EE', 
      '#FF0080',
      '#00FF41',
      '#FFD700',
      '#FF69B4',
      '#00FFF7',
      '#9D00FF'
    ];

    const particleCount = window.innerWidth > 768 ? 250 : 150;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        vz: (Math.random() - 0.5) * 4,
        size: Math.random() * 5 + 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.7 + 0.3,
        pulse: Math.random() * Math.PI * 2,
        trail: [],
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.008;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        // Store trail position
        p.trail.push({x: p.x, y: p.y, z: p.z});
        if (p.trail.length > 8) p.trail.shift();
        
        // Enhanced movement with wave patterns
        p.x += p.vx + Math.sin(time + i * 0.1) * 0.8;
        p.y += p.vy + Math.cos(time + i * 0.1) * 0.8;
        p.z += p.vz + Math.sin(time * 0.5) * 0.5;
        
        // Update pulse
        p.pulse += 0.05;

        // Enhanced mouse interaction with attraction/repulsion
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200) {
          const force = (200 - dist) / 200;
          const angle = Math.atan2(dy, dx);
          p.x -= Math.cos(angle) * force * 3;
          p.y -= Math.sin(angle) * force * 3;
          p.vx += (Math.random() - 0.5) * 0.1;
          p.vy += (Math.random() - 0.5) * 0.1;
        }

        // Wrap around edges
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;
        if (p.z < 0) p.z = 1000;
        if (p.z > 1000) p.z = 0;

        const scale = 1000 / (1000 + p.z);
        const x = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const y = (p.y - canvas.height / 2) * scale + canvas.height / 2;
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;
        const size = p.size * scale * pulseScale;

        // Draw trail
        ctx.beginPath();
        p.trail.forEach((pos, idx) => {
          const trailScale = 1000 / (1000 + pos.z);
          const tx = (pos.x - canvas.width / 2) * trailScale + canvas.width / 2;
          const ty = (pos.y - canvas.height / 2) * trailScale + canvas.height / 2;
          const trailOpacity = (idx / p.trail.length) * p.opacity * 0.3;
          
          if (idx === 0) {
            ctx.moveTo(tx, ty);
          } else {
            ctx.lineTo(tx, ty);
          }
        });
        ctx.strokeStyle = `${p.color}${Math.floor(p.opacity * 0.2 * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = size * 0.3;
        ctx.stroke();

        // Enhanced particle glow
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
        const alpha = Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        gradient.addColorStop(0, `${p.color}${alpha}`);
        gradient.addColorStop(0.5, `${p.color}${Math.floor(p.opacity * 0.6 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${p.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.arc(x, y, size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle with enhanced glow
        ctx.shadowBlur = 15 * scale;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.shadowBlur = 0;

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dz2 = p.z - p2.z;
          const distance = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2);

          if (distance < 100) {
            const scale2 = 1000 / (1000 + p2.z);
            const x2 = (p2.x - canvas.width / 2) * scale2 + canvas.width / 2;
            const y2 = (p2.y - canvas.height / 2) * scale2 + canvas.height / 2;

            ctx.beginPath();
            ctx.strokeStyle = `${p.color}${Math.floor((1 - distance / 100) * 0.3 * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = (1 - distance / 100) * 2 * scale;
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0f1419 100%)' }}
    />
  );
}
