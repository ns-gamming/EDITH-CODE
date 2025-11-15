import { Editor } from "@monaco-editor/react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { File } from "@shared/schema";

interface MonacoEditorProps {
  files: File[];
  activeFileId: string | null;
  onFileChange: (fileId: string, content: string) => void;
  onFileSelect: (fileId: string) => void;
  onFileClose: (fileId: string) => void;
  onNewFile: () => void;
}

export function MonacoEditor({
  files,
  activeFileId,
  onFileChange,
  onFileSelect,
  onFileClose,
  onNewFile,
}: MonacoEditorProps) {
  const { theme } = useTheme();
  const activeFile = files.find(f => f.id === activeFileId);

  const getMonacoTheme = () => {
    if (theme === "white") return "light";
    return "vs-dark";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Tab Bar */}
      <div className="border-b border-border bg-card">
        <ScrollArea className="w-full">
          <div className="flex items-center gap-1 p-1">
            {files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all hover-elevate ${
                  activeFileId === file.id
                    ? "bg-background"
                    : "bg-transparent"
                }`}
                onClick={() => onFileSelect(file.id)}
                data-testid={`tab-file-${file.id}`}
              >
                <span className="text-sm font-mono">{file.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileClose(file.id);
                  }}
                  className="hover-elevate-2 rounded"
                  data-testid={`button-close-file-${file.id}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewFile}
              className="px-2"
              data-testid="button-new-file-tab"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Editor */}
      <div className="flex-1 relative">
        {activeFile ? (
          <Editor
            height="100%"
            language={activeFile.language || "javascript"}
            value={activeFile.content}
            onChange={(value) => onFileChange(activeFile.id, value || "")}
            theme={getMonacoTheme()}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">Select a file from the tree or create a new one</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-6 px-4 flex items-center justify-between bg-card border-t border-border text-xs text-muted-foreground">
        <div>
          {activeFile && (
            <span className="font-mono">{activeFile.path}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {activeFile && (
            <>
              <span>{activeFile.language || "plaintext"}</span>
              <span>UTF-8</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
