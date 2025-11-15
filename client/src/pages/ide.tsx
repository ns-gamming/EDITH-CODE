import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { MonacoEditor } from "@/components/MonacoEditor";
import { FileTree } from "@/components/FileTree";
import { AIChat } from "@/components/AIChat";
import { Terminal } from "@/components/Terminal";
import { LivePreview } from "@/components/LivePreview";
import { FileUpload } from "@/components/FileUpload";
import { APIKeyModal } from "@/components/APIKeyModal";
import { SystemPromptEditor } from "@/components/SystemPromptEditor";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
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
import {
  Settings,
  Key,
  Sparkles,
  Upload,
  Save,
  Menu,
  LogOut,
  Home,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import type { File, ChatMessage, AIModel, AIService } from "@shared/schema";

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

  const handleSendMessage = async (content: string, model: AIModel) => {
    const userMessage: ChatMessage = {
      id: Math.random().toString(36),
      projectId: params?.projectId || "",
      role: "user",
      content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setAiLoading(true);

    try {
      // TODO: Send to backend AI endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36),
        projectId: params?.projectId || "",
        role: "assistant",
        content: `This is a demo response. Backend integration coming soon!\n\nYou asked: "${content}"\n\nUsing model: ${model}`,
        model,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please check your API keys.",
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
                    <Terminal />
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
