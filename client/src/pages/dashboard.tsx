
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Fluid3DBackground } from "@/components/Fluid3DBackground";
import { GitHubImport } from "@/components/GitHubImport";
import { AIProjectCreator } from "@/components/AIProjectCreator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, Plus, Search, TrendingUp, Zap, Code2, Sparkles, FileCode, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.id) {
        // If no user, redirect to auth after a short delay
        const timer = setTimeout(() => {
          setLocation('/auth');
        }, 1000);
        return () => clearTimeout(timer);
      }
      try {
        const response = await fetch(`/api/projects?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else if (response.status === 401) {
          setLocation('/auth');
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please refresh the page.',
          variant: 'destructive',
        });
      }
    };
    
    fetchProjects();
  }, [user?.id, setLocation, toast]);

  const handleProjectOpen = (projectId: string) => {
    setLocation(`/ide/${projectId}`);
  };

  const handleProjectCreate = async () => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          name: 'New Project',
          description: 'A new AI-powered project',
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create project');
      const newProject = await response.json();
      
      setProjects((prev) => [...prev, newProject]);
      setLocation(`/ide/${newProject.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleProjectDelete = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    toast({
      title: "Project Deleted",
      description: "The project has been deleted successfully.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation("/auth");
  };

  const quickActions = [
    { icon: Code2, label: "New Repl", action: handleProjectCreate, gradient: "from-cyan-500 to-blue-500" },
    { icon: Search, label: "Templates", action: () => {}, gradient: "from-purple-500 to-pink-500" },
    { icon: TrendingUp, label: "Analytics", action: () => {}, gradient: "from-green-500 to-emerald-500" },
    { icon: Zap, label: "Quick Start", action: () => setLocation("/ide"), gradient: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Fluid3DBackground />

      {/* Top Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="h-16 border-b border-primary/20 bg-card/40 backdrop-blur-xl flex items-center justify-between px-8 relative z-10"
      >
        <motion.div
          className="flex items-center gap-4"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            animate={{
              textShadow: [
                "0 0 20px rgba(6, 182, 212, 0.5)",
                "0 0 40px rgba(6, 182, 212, 0.8)",
                "0 0 20px rgba(6, 182, 212, 0.5)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              EDITH
            </h1>
          </motion.div>
          <motion.span
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Even Dead I Am The Hero
          </motion.span>
        </motion.div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" className="gap-2" data-testid="button-user-menu-dashboard">
                  <Avatar className="w-8 h-8 ring-2 ring-primary/50">
                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                      {profile?.fullName?.[0] || profile?.username?.[0] || user?.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline">{profile?.fullName || profile?.username || user?.email}</span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-primary/20">
              <DropdownMenuItem onClick={() => setLocation("/profile")} data-testid="menu-profile-dashboard">
                <Settings className="w-4 h-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="menu-settings-dashboard">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} data-testid="menu-signout-dashboard">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <motion.h2
              className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 200%" }}
            >
              {greeting}, {profile?.fullName || profile?.username || "Developer"}!
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Ready to build something amazing?
            </motion.p>
          </motion.div>

          {/* Quick Actions - Enhanced with AI & GitHub Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Create New Project
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full"
                >
                  <Button 
                    variant="outline" 
                    onClick={handleProjectCreate}
                    className="w-full h-24 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 hover:border-blue-500/50 transition-all"
                  >
                    <FileCode className="w-8 h-8 text-blue-400" />
                    <div className="text-center">
                      <div className="font-semibold text-sm">Blank Project</div>
                      <div className="text-xs text-muted-foreground">Start from scratch</div>
                    </div>
                  </Button>
                </motion.div>
                
                <AIProjectCreator 
                  onProjectCreate={handleProjectOpen} 
                  userId={user?.id || ''} 
                />
                
                <GitHubImport 
                  onImportComplete={handleProjectOpen} 
                  userId={user?.id || ''} 
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * i }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action.action}
                    className="p-6 rounded-2xl bg-card/40 backdrop-blur-xl border border-primary/20 hover:border-primary/50 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 group"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">{action.label}</h3>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ProjectDashboard
              projects={projects}
              onProjectOpen={handleProjectOpen}
              onProjectCreate={handleProjectCreate}
              onProjectDelete={handleProjectDelete}
            />
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { label: "Total Projects", value: projects.length, icon: Code2 },
              { label: "Active Today", value: "0", icon: Zap },
              { label: "Collaborators", value: "0", icon: Sparkles },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, y: -5 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-xl border border-primary/20 hover:border-primary/40 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <motion.div
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {stat.value}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer Branding */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="py-8 text-center text-sm text-muted-foreground relative z-10"
      >
        Created by <span className="font-semibold text-primary">NISHANT SARKAR</span>
      </motion.footer>
    </div>
  );
}
