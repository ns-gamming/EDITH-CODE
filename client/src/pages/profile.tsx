
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Save, Camera, Code, Trophy, Zap, Sparkles, Rocket, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    occupation: "",
    experience_level: "",
    favorite_languages: [] as string[],
    project_goals: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        occupation: profile.occupation || "",
        experience_level: profile.experience_level || "",
        favorite_languages: profile.favorite_languages || [],
        project_goals: profile.project_goals || "",
      });
    }
  }, [profile]);

  // Enhanced 3D particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      color: string;
      pulse: number;
    }> = [];

    const colors = ["#06b6d4", "#8b5cf6", "#ec4899", "#10b981"];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          const force = (200 - distance) / 200;
          p.vx += (dx / distance) * force * 0.05;
          p.vy += (dy / distance) * force * 0.05;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.pulse += 0.05;

        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (p.z < 0 || p.z > 1000) p.vz *= -1;

        const scale = 1000 / (1000 - p.z);
        const size = p.size * scale * (1 + Math.sin(p.pulse) * 0.3);
        const opacity = 0.3 + Math.sin(p.pulse) * 0.3;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 2);
        gradient.addColorStop(0, p.color + Math.floor(opacity * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(0.5, p.color + '44');
        gradient.addColorStop(1, p.color + '00');

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw connections
        particles.slice(i + 1, i + 4).forEach(p2 => {
          const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${(1 - dist / 150) * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast({
        title: "✨ Profile Updated",
        description: "Your profile has been saved successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const statsData = [
    { icon: Code, label: "Projects", value: "12", color: "from-cyan-400 to-blue-500" },
    { icon: Zap, label: "AI Requests", value: "248", color: "from-yellow-400 to-orange-500" },
    { icon: Trophy, label: "Achievements", value: "5", color: "from-purple-400 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

      <div className="relative z-10 p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => setLocation("/dashboard")}
              className="mb-6 text-white hover:bg-white/10 group"
            >
              <motion.div
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
              </motion.div>
              Back to Dashboard
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: -10 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gray-900/90 backdrop-blur-xl border-purple-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />
                <CardContent className="pt-8 text-center relative">
                  <motion.div
                    className="relative inline-block mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      style={{ padding: "4px" }}
                    />
                    <Avatar className="w-32 h-32 border-4 border-gray-900 relative z-10">
                      <AvatarFallback className="text-4xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white">
                        {formData.full_name?.[0] || profile?.full_name?.[0] || user?.email?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="icon"
                        className="absolute bottom-0 right-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  <motion.h2
                    className="text-2xl font-bold text-white mb-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {formData.full_name || profile?.full_name || "User"}
                  </motion.h2>
                  <motion.p
                    className="text-gray-400 mb-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    @{formData.username || profile?.username || "username"}
                  </motion.p>
                  
                  {(formData.occupation || profile?.occupation) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4"
                    >
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      <span className="text-sm text-purple-300">{formData.occupation || profile?.occupation}</span>
                    </motion.div>
                  )}

                  <div className="mt-6 space-y-3">
                    <AnimatePresence>
                      {statsData.map((stat, index) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          whileHover={{ scale: 1.03, x: 5 }}
                          className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg backdrop-blur-sm group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <motion.div
                              className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                              whileHover={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 0.4 }}
                            >
                              <stat.icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{stat.label}</span>
                          </div>
                          <motion.span
                            className="font-bold text-white text-lg"
                            whileHover={{ scale: 1.2 }}
                          >
                            {stat.value}
                          </motion.span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {formData.experience_level && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg border border-cyan-500/20"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Rocket className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-gray-400 uppercase tracking-wider">Experience Level</span>
                      </div>
                      <p className="text-white font-semibold capitalize">{formData.experience_level}</p>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Edit Profile Form */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, rotateY: 10 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              className="lg:col-span-2"
            >
              <Card className="bg-gray-900/90 backdrop-blur-xl border-purple-500/30 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8 text-cyan-400" />
                    </motion.div>
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 relative">
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label className="text-gray-300 flex items-center gap-2 mb-2">
                        Full Name
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-cyan-400"
                        >
                          *
                        </motion.span>
                      </Label>
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="bg-gray-800/80 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                        placeholder="Enter your full name"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Label className="text-gray-300 flex items-center gap-2 mb-2">
                        Username
                        <motion.span
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="text-purple-400"
                        >
                          *
                        </motion.span>
                      </Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-gray-800/80 border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                        placeholder="Choose a username"
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label className="text-gray-300 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-pink-400" />
                      Bio
                    </Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="bg-gray-800/80 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500/20 transition-all resize-none"
                      rows={3}
                      placeholder="Tell us about yourself..."
                    />
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
                    >
                      <Label className="text-gray-300 mb-2">Occupation</Label>
                      <Input
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="bg-gray-800/80 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                        placeholder="e.g., Full Stack Developer"
                      />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label className="text-gray-300 mb-2">Experience Level</Label>
                      <select
                        value={formData.experience_level}
                        onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                        className="w-full p-2 bg-gray-800/80 border border-gray-700 rounded-md text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      >
                        <option value="">Select...</option>
                        <option value="beginner">🌱 Beginner</option>
                        <option value="intermediate">🚀 Intermediate</option>
                        <option value="advanced">⚡ Advanced</option>
                        <option value="expert">🏆 Expert</option>
                      </select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <Label className="text-gray-300 mb-2 flex items-center gap-2">
                      <Code className="w-4 h-4 text-cyan-400" />
                      Favorite Languages
                    </Label>
                    <Input
                      value={formData.favorite_languages.join(", ")}
                      onChange={(e) => setFormData({
                        ...formData,
                        favorite_languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                      })}
                      className="bg-gray-800/80 border-gray-700 text-white focus:border-cyan-500 focus:ring-cyan-500/20 transition-all"
                      placeholder="JavaScript, Python, TypeScript, etc."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label className="text-gray-300 mb-2">Project Goals</Label>
                    <Textarea
                      value={formData.project_goals}
                      onChange={(e) => setFormData({ ...formData, project_goals: e.target.value })}
                      className="bg-gray-800/80 border-gray-700 text-white focus:border-pink-500 focus:ring-pink-500/20 transition-all resize-none"
                      rows={3}
                      placeholder="What would you like to build?"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.65 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-600 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-700 text-white font-semibold py-6 text-lg shadow-xl shadow-purple-500/50 relative overflow-hidden group"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {isSaving ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Save Changes
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
