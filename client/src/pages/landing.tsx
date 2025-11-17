import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Sparkles, Zap, Rocket, Users, Shield, Terminal, Layers, GitBranch } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

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
      trail: Array<{ x: number; y: number; opacity: number }>;
      rotation: number;
      rotationSpeed: number;
    }> = [];

    const colors = [
      "#00FF41", "#00D9FF", "#FF0080", "#7B68EE", 
      "#FFD700", "#00FFA3", "#FF1493", "#00BFFF"
    ];
    const particleCount = 200;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1500,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        vz: (Math.random() - 0.5) * 3,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
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
      time += 0.005;
      
      ctx.fillStyle = "rgba(10, 10, 15, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const spiralSpeed = 0.0015;
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const angle = Math.atan2(dy, dx) + spiralSpeed;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const targetDistance = distance * (1 + Math.sin(time + i * 0.1) * 0.01);

        p.x = centerX + Math.cos(angle) * targetDistance;
        p.y = centerY + Math.sin(angle) * targetDistance;

        const mdx = mouseX - p.x;
        const mdy = mouseY - p.y;
        const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mouseDistance < 250) {
          const force = (250 - mouseDistance) / 250;
          const angle = Math.atan2(mdy, mdx);
          p.vx += Math.cos(angle) * force * 0.5;
          p.vy += Math.sin(angle) * force * 0.5;
        }

        p.y += Math.sin(time * 2 + i * 0.15) * 0.8;
        p.x += Math.cos(time * 2 + i * 0.15) * 0.6;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.vz *= 0.96;

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;
        if (p.z < 0) p.z = 1500;
        if (p.z > 1500) p.z = 0;

        p.rotation += p.rotationSpeed;

        const perspective = 1200 / (1200 + p.z);
        const x3d = (p.x - canvas.width / 2) * perspective + canvas.width / 2;
        const y3d = (p.y - canvas.height / 2) * perspective + canvas.height / 2;
        const size3d = p.size * perspective;

        p.trail.push({ x: x3d, y: y3d, opacity: 1 });
        if (p.trail.length > 8) p.trail.shift();

        p.trail.forEach((t, idx) => {
          t.opacity *= 0.85;
          const trailSize = size3d * (idx / p.trail.length);
          ctx.beginPath();
          ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color + Math.floor(t.opacity * 100).toString(16).padStart(2, '0');
          ctx.fill();
        });

        particles.forEach((p2, j) => {
          if (i === j) return;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dz = p.z - p2.z;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.4;
            const perspective2 = 1200 / (1200 + p2.z);
            const x3d2 = (p2.x - canvas.width / 2) * perspective2 + canvas.width / 2;
            const y3d2 = (p2.y - canvas.height / 2) * perspective2 + canvas.height / 2;
            
            const gradient = ctx.createLinearGradient(x3d, y3d, x3d2, y3d2);
            gradient.addColorStop(0, p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            gradient.addColorStop(1, p2.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
            
            ctx.beginPath();
            ctx.moveTo(x3d, y3d);
            ctx.lineTo(x3d2, y3d2);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        });

        const glowGradient = ctx.createRadialGradient(x3d, y3d, 0, x3d, y3d, size3d * 6);
        glowGradient.addColorStop(0, p.color + "FF");
        glowGradient.addColorStop(0.3, p.color + "AA");
        glowGradient.addColorStop(0.6, p.color + "44");
        glowGradient.addColorStop(1, p.color + "00");

        ctx.beginPath();
        ctx.arc(x3d, y3d, size3d * 6, 0, Math.PI * 2);
        ctx.fillStyle = glowGradient;
        ctx.fill();

        ctx.save();
        ctx.translate(x3d, y3d);
        ctx.rotate(p.rotation);

        const coreGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size3d * 2);
        coreGradient.addColorStop(0, "#FFFFFF");
        coreGradient.addColorStop(0.3, p.color);
        coreGradient.addColorStop(1, p.color + "00");

        ctx.beginPath();
        ctx.arc(0, 0, size3d * 2, 0, Math.PI * 2);
        ctx.fillStyle = coreGradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, size3d, 0, Math.PI * 2);
        ctx.fillStyle = "#FFFFFF";
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      <canvas ref={canvasRef} className="fixed inset-0 opacity-70 pointer-events-none z-0" />

      {/* Quick Navigation */}
      <motion.nav 
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-card/40 border border-primary/20 rounded-full px-6 py-3 shadow-2xl shadow-primary/20"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-6">
          {[
            { id: "hero", label: "Home" },
            { id: "features", label: "Features" },
            { id: "capabilities", label: "Capabilities" },
            { id: "cta", label: "Get Started" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-sm font-medium transition-all duration-300 hover:text-primary ${
                activeSection === item.id ? "text-primary scale-110" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4">
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
        </div>

        <motion.div
          className="relative z-10 text-center"
          style={{ opacity, scale }}
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
              transform: "translateZ(50px)",
              transformStyle: "preserve-3d",
            }}
          >
            EDITH
          </motion.h1>

          <motion.p 
            className="mb-4 text-2xl md:text-4xl font-semibold text-foreground max-w-4xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ transform: "translateZ(30px)" }}
          >
            Enhanced Development Interface for
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Technology and Hacking
            </span>
          </motion.p>

          <motion.p 
            className="mb-12 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Build, deploy, and collaborate on projects with the power of AI.
            Experience intelligent code generation, real-time collaboration, and
            seamless deployment.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              size="lg"
              onClick={() => setLocation("/auth")}
              className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all duration-300 transform hover:scale-105"
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
              className="px-8 py-6 text-lg font-semibold border-2 border-primary/50 hover:border-primary hover:bg-primary/10 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
            >
              <Code2 className="w-5 h-5 mr-2" />
              View Demo
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build amazing projects with AI assistance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Code2, 
                title: "Smart Coding", 
                desc: "AI-powered code completion and intelligent suggestions",
                color: "from-cyan-500 to-blue-500"
              },
              { 
                icon: Zap, 
                title: "Real-time Collaboration", 
                desc: "Work together seamlessly with your team in real-time",
                color: "from-purple-500 to-pink-500"
              },
              { 
                icon: Sparkles, 
                title: "Auto Deploy", 
                desc: "One-click deployment to production environments",
                color: "from-green-500 to-emerald-500"
              },
              { 
                icon: Terminal, 
                title: "Integrated Terminal", 
                desc: "Built-in terminal with full command-line access",
                color: "from-orange-500 to-red-500"
              },
              { 
                icon: Layers, 
                title: "Project Templates", 
                desc: "Kickstart your projects with pre-built templates",
                color: "from-violet-500 to-purple-500"
              },
              { 
                icon: GitBranch, 
                title: "Version Control", 
                desc: "Git integration for seamless version management",
                color: "from-blue-500 to-indigo-500"
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-card/40 backdrop-blur-md border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-2xl mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              Built for Developers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete development environment designed for modern workflows
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                icon: Rocket,
                title: "Lightning Fast Performance",
                description: "Optimized for speed with instant hot-reload and minimal latency",
                features: ["Sub-second builds", "Real-time preview", "Edge deployment"]
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together with advanced collaboration features",
                features: ["Live cursors", "Shared projects", "Comment threads"]
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade security for your code and projects",
                features: ["End-to-end encryption", "2FA support", "SOC 2 compliant"]
              },
              {
                icon: Sparkles,
                title: "AI Assistant - EDITH",
                description: "Your intelligent coding companion powered by advanced AI",
                features: ["Code generation", "Bug detection", "Optimization tips"]
              },
            ].map((capability, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl border border-primary/30 hover:border-primary/60 transition-all duration-500 group"
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-primary/50">
                    <capability.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-3">{capability.title}</h3>
                    <p className="text-muted-foreground mb-4">{capability.description}</p>
                    <ul className="space-y-2">
                      {capability.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Nav Section */}
      <section className="py-20 bg-gradient-to-b from-black/40 to-black/60">
        <div className="container mx-auto px-6">
          <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Dashboard", desc: "Manage your projects", icon: "📊", link: "/dashboard" },
              { title: "IDE", desc: "Start coding now", icon: "💻", link: "/ide" },
              { title: "Profile", desc: "Your account settings", icon: "👤", link: "/profile" },
              { title: "Documentation", desc: "Learn how to use EDITH", icon: "📚", link: "#features" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="group bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400 transition-all duration-500 transform-3d hover:scale-105 hover:rotate-y-6 hover:shadow-2xl hover:shadow-cyan-500/30"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-600/20 backdrop-blur-xl border border-primary/30 shadow-2xl shadow-primary/20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers already using EDITH to build amazing projects
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
            >
              <Button
                size="lg"
                onClick={() => setLocation("/auth")}
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700 text-white px-10 py-7 text-xl font-semibold shadow-xl shadow-primary/50 hover:shadow-2xl hover:shadow-primary/60 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Start Building Now
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              VibeCoder
            </h3>
            <p className="text-gray-400">Powered by EDITH - Your AI Coding Partner</p>
          </div>
          <p className="text-muted-foreground mb-2">
            Created by <span className="font-bold text-primary">NISHANT SARKAR</span>
          </p>
          <p className="text-sm text-muted-foreground">
            © 2024 VibeCoder / NS GAMMING. All rights reserved.
          </p>
        </div>
      </footer>

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