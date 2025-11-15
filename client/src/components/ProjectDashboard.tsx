import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, FolderOpen, Clock } from "lucide-react";
import type { Project } from "@shared/schema";
import { useState } from "react";

interface ProjectDashboardProps {
  projects: Project[];
  onProjectOpen: (projectId: string) => void;
  onProjectCreate: () => void;
  onProjectDelete: (projectId: string) => void;
}

export function ProjectDashboard({
  projects,
  onProjectOpen,
  onProjectCreate,
  onProjectDelete,
}: ProjectDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Projects
          </h1>
          <p className="text-muted-foreground">Manage and access your AI-powered coding projects</p>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-projects"
            />
          </div>
          <Button onClick={onProjectCreate} data-testid="button-create-project">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* New Project Card */}
          <Card
            className="border-2 border-dashed border-border hover-elevate cursor-pointer transition-all"
            onClick={onProjectCreate}
            data-testid="card-new-project"
          >
            <CardContent className="flex flex-col items-center justify-center h-64">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Create New Project</h3>
              <p className="text-sm text-muted-foreground text-center">
                Start a new AI-powered coding project
              </p>
            </CardContent>
          </Card>

          {/* Project Cards */}
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover-elevate cursor-pointer transition-all group"
              onClick={() => onProjectOpen(project.id)}
              data-testid={`card-project-${project.id}`}
            >
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-md mb-3 flex items-center justify-center">
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <FolderOpen className="w-12 h-12 text-primary opacity-50" />
                  )}
                </div>
                <CardTitle className="text-lg truncate">{project.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                  {project.description || "No description"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(project.updatedAt).toLocaleDateString()}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProjectDelete(project.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  data-testid={`button-delete-project-${project.id}`}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No projects found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
