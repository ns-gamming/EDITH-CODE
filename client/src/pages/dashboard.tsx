import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings } from "lucide-react";
import type { Project } from "@shared/schema";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // TODO: Fetch projects from backend
    // Temporary mock data
    setProjects([]);
  }, []);

  const handleProjectOpen = (projectId: string) => {
    setLocation(`/ide/${projectId}`);
  };

  const handleProjectCreate = () => {
    // TODO: Create project via backend
    const newProject: Project = {
      id: Math.random().toString(36),
      userId: user?.id || "",
      name: "New Project",
      description: "A new AI-powered project",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProjects((prev) => [...prev, newProject]);
    setLocation(`/ide/${newProject.id}`);
  };

  const handleProjectDelete = (projectId: string) => {
    // TODO: Delete project via backend
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

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent gaming:glow-text">
            EDITH
          </h1>
          <span className="text-sm text-muted-foreground">Even Dead I Am The Hero</span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2" data-testid="button-user-menu-dashboard">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{user?.fullName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline">{user?.fullName || user?.email}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
      </header>

      {/* Main Content */}
      <ProjectDashboard
        projects={projects}
        onProjectOpen={handleProjectOpen}
        onProjectCreate={handleProjectCreate}
        onProjectDelete={handleProjectDelete}
      />

      {/* Footer Branding */}
      <footer className="py-8 text-center text-sm text-muted-foreground">
        Created by <span className="font-semibold text-foreground">NISHANT SARKAR</span>
      </footer>
    </div>
  );
}
