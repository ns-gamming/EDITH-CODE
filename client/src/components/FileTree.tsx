import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import type { File } from "@shared/schema";

interface FileTreeProps {
  files: File[];
  activeFileId: string | null;
  onFileSelect: (fileId: string) => void;
  onFileDelete: (fileId: string) => void;
  onFileCreate: (name: string, path: string) => void;
}

export function FileTree({
  files,
  activeFileId,
  onFileSelect,
  onFileDelete,
  onFileCreate,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["/"]));
  const [newFileName, setNewFileName] = useState("");
  const [showNewFile, setShowNewFile] = useState(false);

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName, `/${newFileName}`);
      setNewFileName("");
      setShowNewFile(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-3 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Files</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowNewFile(!showNewFile)}
            data-testid="button-add-file"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {showNewFile && (
          <div className="flex gap-2">
            <Input
              placeholder="filename.js"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
              className="h-8 text-sm"
              data-testid="input-new-filename"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleCreateFile}
              data-testid="button-create-file"
            >
              Add
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-all hover-elevate ${
                activeFileId === file.id ? "bg-accent" : ""
              }`}
              onClick={() => onFileSelect(file.id)}
              data-testid={`file-item-${file.id}`}
            >
              <FileText className="w-4 h-4 text-primary" />
              <span className="flex-1 text-sm font-mono truncate">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover-elevate-2 p-1 rounded"
                data-testid={`button-delete-file-${file.id}`}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </button>
            </div>
          ))}

          {files.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No files yet. Click + to create one.
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
