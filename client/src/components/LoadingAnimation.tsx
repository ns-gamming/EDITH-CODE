import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function LoadingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    let rotation = 0;
    let time = 0;

    const animate = () => {
      time += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(200, 200);
      ctx.rotate(rotation);

      // Outer rotating ring
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const radius = 80 + Math.sin(time + i) * 10;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const size = 15 + Math.sin(time + i * 0.5) * 5;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `hsla(${180 + i * 30}, 100%, 70%, 1)`);
        gradient.addColorStop(0.5, `hsla(${180 + i * 30}, 100%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${180 + i * 30}, 100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsla(${180 + i * 30}, 100%, 60%, 0.5)`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${180 + i * 30}, 100%, 80%, 1)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Connecting lines between layers
      ctx.strokeStyle = "rgba(139, 92, 246, 0.15)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 + rotation;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * 140, Math.sin(angle) * 140);
        ctx.stroke();
      }

      // Center pulsing core with multiple layers
      for (let i = 0; i < 3; i++) {
        const pulse = Math.sin(time * 4 - i * 0.5) * 0.3 + 0.7;
        const centerSize = (30 - i * 8) * pulse;
        const centerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, centerSize);

        const alpha = 1 - i * 0.3;
        centerGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        centerGradient.addColorStop(0.3, `rgba(139, 92, 246, ${alpha * 0.9})`);
        centerGradient.addColorStop(0.7, `rgba(59, 130, 246, ${alpha * 0.6})`);
        centerGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctx.beginPath();
        ctx.arc(0, 0, centerSize, 0, Math.PI * 2);
        ctx.fillStyle = centerGradient;
        ctx.shadowBlur = 30;
        ctx.shadowColor = "rgba(139, 92, 246, 0.5)";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
      rotation += 0.02;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <canvas ref={canvasRef} className="mx-auto mb-8 drop-shadow-2xl" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h1 
            className="text-7xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% 200%",
            }}
          >
            EDITH
          </motion.h1>
          <motion.p 
            className="text-gray-400 text-xl mb-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Even Dead I Am The Hero
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-lg shadow-cyan-500/50"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}