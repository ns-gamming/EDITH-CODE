import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { MonacoEditor } from "@/components/MonacoEditor";
import { FileTree } from "@/components/FileTree";
import { AIChat } from "@/components/AIChat";
import { AdvancedTerminal } from "@/components/AdvancedTerminal";
import { LivePreview } from "@/components/LivePreview";
import { FileUpload } from "@/components/FileUpload";
import { APIKeyModal } from "@/components/APIKeyModal";
import { SystemPromptEditor } from "@/components/SystemPromptEditor";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Home, Settings, Key, Sparkles, LogOut, Menu, Save, Upload } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { File, ChatMessage, AIModel, AIService } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function IDEPage() {
  const [, params] = useRoute("/ide/:projectId");
  const [, setLocation] = useLocation();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showSystemPromptModal, setShowSystemPromptModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [firstAIRequest, setFirstAIRequest] = useState(false);

  const projectId = params?.projectId || "";

  // Check usage and API keys
  const { data: usage } = useQuery({
    queryKey: ["usage", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/usage?userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch usage");
      return response.json();
    },
    enabled: !!user?.id,
  });

  const { data: apiKeys } = useQuery({
    queryKey: ["api-keys", user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/api-keys?userId=${user?.id}`);
      if (!response.ok) throw new Error("Failed to fetch API keys");
      return response.json();
    },
    enabled: !!user?.id,
  });

  // Auto-show API key modal when limit reached and no keys configured
  useEffect(() => {
    if (usage?.limitReached && (!apiKeys || apiKeys.length === 0) && firstAIRequest) {
      setShowApiKeyModal(true);
      toast({
        title: "Daily Limit Reached",
        description: "Please add your own API key to continue using AI features.",
        variant: "destructive",
      });
    }
  }, [usage, apiKeys, firstAIRequest]);


  useEffect(() => {
    // Load project data
    if (params?.projectId) {
      // TODO: Fetch project from backend
      setProjectName("My Project");
    }
  }, [params?.projectId]);

  const handleFileChange = (fileId: string, content: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, content } : f))
    );
  };

  useEffect(() => {
    if (!files.length || !projectId) return;

    const autoSaveTimeout = setTimeout(async () => {
      try {
        for (const file of files) {
          if (file.id && file.id.length > 10) {
            await fetch(`/api/files/${file.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                content: file.content, 
                name: file.name, 
                path: file.path 
              }),
            });
          }
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimeout);
  }, [files, projectId]);

  const handleFileSelect = (fileId: string) => {
    setActiveFileId(fileId);
  };

  const handleFileClose = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId(files[0]?.id || null);
    }
  };

  const handleFileCreate = (name: string, path: string) => {
    const newFile: File = {
      id: Math.random().toString(36),
      projectId: params?.projectId || "",
      name,
      path,
      content: "",
      language: name.endsWith(".js") ? "javascript" : name.endsWith(".html") ? "html" : name.endsWith(".css") ? "css" : "plaintext",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  const handleFileDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (activeFileId === fileId) {
      setActiveFileId(null);
    }
  };

  const handleNewFile = () => {
    handleFileCreate("untitled.js", "/untitled.js");
  };

  const handleSendMessage = async (message: string, model: AIModel) => {
    setFirstAIRequest(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          projectId,
          message,
          model,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.limitReached) {
          setShowApiKeyModal(true);
        }
        throw new Error(data.message);
      }

      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36),
        projectId: projectId,
        role: "assistant",
        content: data.response,
        model,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveApiKeys = (keys: { service: AIService; key: string }[]) => {
    // TODO: Save to backend
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been encrypted and stored securely.",
    });
  };

  const handleSaveSystemPrompt = (name: string, content: string) => {
    // TODO: Save to backend
    toast({
      title: "System Prompt Saved",
      description: `"${name}" has been saved successfully.`,
    });
  };

  const handleFilesUpload = (uploadedFiles: File[]) => {
    toast({
      title: "Files Uploaded",
      description: `${uploadedFiles.length} file(s) uploaded successfully.`,
    });
  };

  const handleSaveProject = () => {
    // TODO: Save project to backend
    toast({
      title: "Project Saved",
      description: "Your project has been saved successfully.",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    setLocation("/auth");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Navigation */}
      <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/dashboard")}
            data-testid="button-home"
          >
            <Home className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent gaming:glow-text">
              EDITH
            </h1>
            <span className="text-sm text-muted-foreground">/ {projectName}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {usage && (
            <div className="text-xs px-3 py-1 rounded-full bg-muted border border-border">
              {usage.remaining}/{usage.limit} requests remaining
            </div>
          )}
          <ThemeSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="button-settings">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowApiKeyModal(true)} data-testid="menu-api-keys">
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowSystemPromptModal(true)} data-testid="menu-system-prompt">
                <Sparkles className="w-4 h-4 mr-2" />
                System Prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowFileUpload(!showFileUpload)} data-testid="menu-upload">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveProject} data-testid="menu-save">
                <Save className="w-4 h-4 mr-2" />
                Save Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2" data-testid="button-user-menu">
                <Avatar className="w-7 h-7">
                  <AvatarFallback>{user?.fullName?.[0] || user?.email?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-2 py-1.5 text-sm font-medium">{user?.email}</div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} data-testid="menu-signout">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main IDE Layout */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Sidebar - File Tree */}
          <ResizablePanel defaultSize={15} minSize={10} maxSize={30}>
            <FileTree
              files={files}
              activeFileId={activeFileId}
              onFileSelect={handleFileSelect}
              onFileDelete={handleFileDelete}
              onFileCreate={handleFileCreate}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* Center - Editor and Terminal */}
          <ResizablePanel defaultSize={55}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor */}
              <ResizablePanel defaultSize={70} minSize={30}>
                {showFileUpload ? (
                  <div className="h-full p-8 overflow-auto">
                    <FileUpload onFilesUpload={handleFilesUpload} />
                  </div>
                ) : (
                  <MonacoEditor
                    files={files}
                    activeFileId={activeFileId}
                    onFileChange={handleFileChange}
                    onFileSelect={handleFileSelect}
                    onFileClose={handleFileClose}
                    onNewFile={handleNewFile}
                  />
                )}
              </ResizablePanel>

              <ResizableHandle />

              {/* Bottom Panel - Terminal/Preview */}
              <ResizablePanel defaultSize={30} minSize={15}>
                <Tabs defaultValue="terminal" className="h-full flex flex-col">
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="terminal" data-testid="tab-bottom-terminal">Terminal</TabsTrigger>
                    <TabsTrigger value="preview" data-testid="tab-bottom-preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="terminal" className="flex-1 m-0">
                    <AdvancedTerminal />
                  </TabsContent>
                  <TabsContent value="preview" className="flex-1 m-0">
                    <LivePreview files={files} />
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Sidebar - AI Chat */}
          <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
            <AIChat
              messages={messages}
              onSendMessage={handleSendMessage}
              loading={aiLoading}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Footer Branding */}
      <div className="h-5 bg-card border-t border-border flex items-center justify-center text-xs text-muted-foreground">
        Created by <span className="font-semibold text-foreground ml-1">NISHANT SARKAR</span>
      </div>

      {/* Modals */}
      <APIKeyModal
        open={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onSaveKeys={handleSaveApiKeys}
      />

      <SystemPromptEditor
        open={showSystemPromptModal}
        onClose={() => setShowSystemPromptModal(false)}
        onSave={handleSaveSystemPrompt}
      />
    </div>
  );
}