import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Save } from "lucide-react";
import type { SystemPrompt } from "@shared/schema";

interface SystemPromptEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, content: string) => void;
  initialPrompt?: SystemPrompt;
}

const DEFAULT_SYSTEM_PROMPT = `You are EDITH (Even Dead I Am The Hero), an advanced AI coding assistant. You help users write high-quality code, debug issues, and explain complex concepts clearly.

Your capabilities:
- Generate clean, efficient, and well-documented code
- Debug and fix errors in existing code
- Explain programming concepts and best practices
- Suggest improvements and optimizations
- Provide step-by-step guidance for implementations

Guidelines:
- Always write production-ready code
- Include comments for complex logic
- Follow modern best practices
- Consider edge cases and error handling
- Prioritize code readability and maintainability`;

export function SystemPromptEditor({ open, onClose, onSave, initialPrompt }: SystemPromptEditorProps) {
  const [name, setName] = useState(initialPrompt?.name || "Custom System Prompt");
  const [content, setContent] = useState(initialPrompt?.content || DEFAULT_SYSTEM_PROMPT);

  const handleSave = () => {
    if (content.trim()) {
      onSave(name, content);
      onClose();
    }
  };

  const resetToDefault = () => {
    setContent(DEFAULT_SYSTEM_PROMPT);
    setName("Default EDITH Prompt");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]" data-testid="modal-system-prompt">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary gaming:glow-text" />
            Custom System Prompt
          </DialogTitle>
          <DialogDescription>
            Customize EDITH's behavior and personality to match your coding style
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="prompt-name">Prompt Name</Label>
            <Input
              id="prompt-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Prompt"
              className="mt-1"
              data-testid="input-prompt-name"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="prompt-content">System Prompt</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToDefault}
                data-testid="button-reset-prompt"
              >
                Reset to Default
              </Button>
            </div>
            <Textarea
              id="prompt-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your custom system prompt..."
              className="min-h-[300px] font-mono text-sm"
              data-testid="textarea-prompt-content"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Define how EDITH should behave, what it should prioritize, and any specific instructions.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-prompt">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-prompt">
            <Save className="w-4 h-4 mr-2" />
            Save Prompt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
