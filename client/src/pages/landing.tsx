
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  // Advanced 3D Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      connections: number[];
    }> = [];

    const colors = ["#00FF41", "#FF0080", "#7B68EE", "#00D9FF"];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        connections: [],
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      time += 0.01;
      ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p, i) => {
        // 3D rotation effect
        const rotationSpeed = 0.001;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const angle = Math.atan2(dy, dx) + rotationSpeed;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        p.x = centerX + Math.cos(angle) * distance;
        p.y = centerY + Math.sin(angle) * distance;

        // Mouse interaction with fluid physics
        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mouseDistance < 200) {
          const force = (200 - mouseDistance) / 200;
          const angle = Math.atan2(mdy, mdx);
          p.vx += Math.cos(angle) * force * 0.3;
          p.vy += Math.sin(angle) * force * 0.3;
        }

        // Wave motion
        p.y += Math.sin(time + i * 0.1) * 0.5;
        p.x += Math.cos(time + i * 0.1) * 0.3;

        // Update position with velocity
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Apply friction
        p.vx *= 0.98;
        p.vy *= 0.98;
        p.vz *= 0.98;

        // Boundary wrapping with depth
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        if (p.z < 0) p.z = 1000;
        if (p.z > 1000) p.z = 0;

        // Calculate 3D perspective
        const perspective = 1000 / (1000 + p.z);
        const x3d = (p.x - canvas.width / 2) * perspective + canvas.width / 2;
        const y3d = (p.y - canvas.height / 2) * perspective + canvas.height / 2;
        const size3d = p.size * perspective;

        // Draw connections
        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const opacity = 1 - dist / 100;
            ctx.beginPath();
            ctx.moveTo(x3d, y3d);
            const perspective2 = 1000 / (1000 + p2.z);
            const x3d2 = (p2.x - canvas.width / 2) * perspective2 + canvas.width / 2;
            const y3d2 = (p2.y - canvas.height / 2) * perspective2 + canvas.height / 2;
            ctx.lineTo(x3d2, y3d2);
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(x3d, y3d, 0, x3d, y3d, size3d * 3);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.5, p.color + "80");
        gradient.addColorStop(1, p.color + "00");

        ctx.beginPath();
        ctx.arc(x3d, y3d, size3d * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x3d, y3d, size3d, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <canvas ref={canvasRef} className="absolute inset-0 opacity-60" />
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div 
          className="absolute top-1/2 -left-40 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center px-4 text-center transition-all duration-1000 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <motion.div 
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card/80 backdrop-blur-sm px-4 py-2 text-sm shadow-lg shadow-primary/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <span className="font-medium">AI-Powered Development Platform</span>
        </motion.div>

        <motion.h1 
          className="mb-6 text-7xl md:text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient filter drop-shadow-2xl"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          style={{
            backgroundSize: "200% 200%",
          }}
        >
          EDITH
        </motion.h1>

        <motion.p 
          className="mb-4 text-2xl md:text-4xl font-semibold text-foreground max-w-4xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Enhanced Development Interface for
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            Technology and Hacking
          </span>
        </motion.p>

        <motion.p 
          className="mb-12 text-lg md:text-xl text-muted-foreground max-w-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Build, deploy, and collaborate on projects with the power of AI.
          Experience intelligent code generation, real-time collaboration, and
          seamless deployment.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <Button
            size="lg"
            onClick={() => setLocation("/auth")}
            className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => setLocation("/dashboard")}
            className="px-8 py-6 text-lg font-semibold border-2 border-primary/50 hover:border-primary hover:bg-primary/10 backdrop-blur-sm transition-all duration-300"
          >
            <Code2 className="w-5 h-5 mr-2" />
            View Demo
          </Button>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {[
            { icon: Code2, title: "Smart Coding", desc: "AI-powered code completion" },
            { icon: Zap, title: "Real-time Collab", desc: "Work together seamlessly" },
            { icon: Sparkles, title: "Auto Deploy", desc: "One-click deployment" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 rounded-xl bg-card/40 backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              <feature.icon className="w-10 h-10 text-primary mb-3 mx-auto" />
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
