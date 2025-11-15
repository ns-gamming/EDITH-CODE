
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Save, Camera, Code, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    occupation: user?.occupation || "",
    experienceLevel: user?.experienceLevel || "",
    favoriteLanguages: user?.favoriteLanguages || "",
  });

  // 3D particle background effect
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
      vx: number;
      vy: number;
      size: number;
    }> = [];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
      });
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const force = (150 - distance) / 150;
          p.vx += (dx / distance) * force * 0.1;
          p.vy += (dy / distance) * force * 0.1;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.99;
        p.vy *= 0.99;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(6, 182, 212, ${0.5 + Math.random() * 0.5})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-30" />

      <div className="relative z-10 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <Button
            variant="ghost"
            onClick={() => setLocation("/dashboard")}
            className="mb-6 text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gray-900/80 backdrop-blur-xl border-purple-500/30">
                <CardContent className="pt-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="w-32 h-32 border-4 border-cyan-500">
                      <AvatarFallback className="text-4xl">
                        {user?.fullName?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full bg-cyan-500 hover:bg-cyan-600"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{user?.fullName}</h2>
                  <p className="text-gray-400">@{user?.username}</p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm text-gray-300">Projects</span>
                      </div>
                      <span className="font-bold text-white">12</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-300">AI Requests</span>
                      </div>
                      <span className="font-bold text-white">248</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-300">Achievements</span>
                      </div>
                      <span className="font-bold text-white">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Edit Profile Form */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="md:col-span-2"
            >
              <Card className="bg-gray-900/80 backdrop-blur-xl border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    Edit Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Full Name</Label>
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Username</Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Bio</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Occupation</Label>
                      <Input
                        value={formData.occupation}
                        onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Experience Level</Label>
                      <select
                        value={formData.experienceLevel}
                        onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                        className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                      >
                        <option value="">Select...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="expert">Expert</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-300">Favorite Languages</Label>
                    <Input
                      value={formData.favoriteLanguages}
                      onChange={(e) => setFormData({ ...formData, favoriteLanguages: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="JavaScript, Python, TypeScript"
                    />
                  </div>

                  <Button
                    onClick={handleSave}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
