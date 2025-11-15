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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiGooglegemini, SiOpenai, SiAnthropic } from "react-icons/si";
import { AlertCircle, ExternalLink, Key, Check } from "lucide-react";
import type { AIService } from "@shared/schema";

interface APIKeyModalProps {
  open: boolean;
  onClose: () => void;
  onSaveKeys: (keys: { service: AIService; key: string }[]) => void;
  existingKeys?: { service: AIService; keyPreview: string }[];
}

export function APIKeyModal({ open, onClose, onSaveKeys, existingKeys = [] }: APIKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");

  const hasKey = (service: AIService) =>
    existingKeys.some((k) => k.service === service);

  const handleSave = () => {
    const keys: { service: AIService; key: string }[] = [];
    if (geminiKey.trim()) keys.push({ service: "gemini", key: geminiKey });
    if (openaiKey.trim()) keys.push({ service: "openai", key: openaiKey });
    if (anthropicKey.trim()) keys.push({ service: "anthropic", key: anthropicKey });

    onSaveKeys(keys);
    setGeminiKey("");
    setOpenaiKey("");
    setAnthropicKey("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl" data-testid="modal-api-keys">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Key className="w-6 h-6 text-primary" />
            Configure AI API Keys
          </DialogTitle>
          <DialogDescription>
            Add your API keys to enable AI-powered code generation with EDITH
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your API keys are encrypted and stored securely. They never leave your account.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="gemini" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="gemini" data-testid="tab-gemini">
              <SiGooglegemini className="w-4 h-4 mr-2" />
              Gemini
            </TabsTrigger>
            <TabsTrigger value="openai" data-testid="tab-openai">
              <SiOpenai className="w-4 h-4 mr-2" />
              OpenAI
            </TabsTrigger>
            <TabsTrigger value="anthropic" data-testid="tab-anthropic">
              <SiAnthropic className="w-4 h-4 mr-2" />
              Anthropic
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gemini" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="gemini-key">Google Gemini API Key</Label>
                {hasKey("gemini") && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    Key saved
                  </div>
                )}
              </div>
              <Input
                id="gemini-key"
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                data-testid="input-gemini-key"
              />
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
              >
                Get your Gemini API key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Gemini provides fast, affordable AI models. Great for rapid code generation and iteration.
            </p>
          </TabsContent>

          <TabsContent value="openai" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                {hasKey("openai") && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    Key saved
                  </div>
                )}
              </div>
              <Input
                id="openai-key"
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                data-testid="input-openai-key"
              />
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
              >
                Get your OpenAI API key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              OpenAI's GPT-5 offers advanced reasoning and code understanding capabilities.
            </p>
          </TabsContent>

          <TabsContent value="anthropic" className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                {hasKey("anthropic") && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Check className="w-3 h-3" />
                    Key saved
                  </div>
                )}
              </div>
              <Input
                id="anthropic-key"
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => setAnthropicKey(e.target.value)}
                data-testid="input-anthropic-key"
              />
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
              >
                Get your Anthropic API key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Claude Sonnet 4 excels at complex reasoning and detailed code analysis.
            </p>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-keys">
            Cancel
          </Button>
          <Button onClick={handleSave} data-testid="button-save-keys">
            Save API Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
