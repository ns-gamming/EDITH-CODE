import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Sparkles } from "lucide-react";

export interface AIAgentSettings {
  model: 'gemini-2.0-flash-exp' | 'gemini-1.5-flash' | 'gemini-1.5-pro';
  temperature: number;
  thinkingMode: boolean;
  autoFix: boolean;
  codeStyle: 'functional' | 'oop' | 'mixed';
  framework: string;
  verbosity: 'concise' | 'balanced' | 'detailed';
  contextWindow: number;
  customInstructions: string;
  autoRefactor: boolean;
  explainCode: boolean;
  addComments: boolean;
  testGeneration: boolean;
  securityChecks: boolean;
  performanceOptimization: boolean;
  accessibility: boolean;
  maxTokens: number;
}

interface AIAgentConfigProps {
  settings: AIAgentSettings;
  onSettingsChange: (settings: AIAgentSettings) => void;
}

export default function AIAgentConfig({ settings, onSettingsChange }: AIAgentConfigProps) {
  const [localSettings, setLocalSettings] = useState<AIAgentSettings>(settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSettingsChange(localSettings);
    setIsOpen(false);
  };

  const updateSetting = <K extends keyof AIAgentSettings>(
    key: K,
    value: AIAgentSettings[K]
  ) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          data-testid="button-ai-config"
        >
          <Settings className="h-4 w-4" />
          {settings.thinkingMode && (
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Agent Configuration</DialogTitle>
          <DialogDescription>
            Customize how the AI agent thinks, codes, and assists you
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select
              value={localSettings.model}
              onValueChange={(value) => updateSetting('model', value as any)}
            >
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash (Experimental - Fastest)</SelectItem>
                <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</SelectItem>
                <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro (Most Capable)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Creativity (Temperature: {localSettings.temperature})</Label>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={2}
              step={0.1}
              value={[localSettings.temperature]}
              onValueChange={([value]) => updateSetting('temperature', value)}
            />
            <p className="text-xs text-muted-foreground">
              Higher = more creative, Lower = more focused
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="maxTokens">Max Response Length ({localSettings.maxTokens} tokens)</Label>
            </div>
            <Slider
              id="maxTokens"
              min={512}
              max={8192}
              step={256}
              value={[localSettings.maxTokens]}
              onValueChange={([value]) => updateSetting('maxTokens', value)}
            />
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Intelligence Features</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="thinkingMode">Thinking Mode</Label>
                <p className="text-xs text-muted-foreground">AI thinks and plans before coding</p>
              </div>
              <Switch
                id="thinkingMode"
                checked={localSettings.thinkingMode}
                onCheckedChange={(checked) => updateSetting('thinkingMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoFix">Auto-Fix Errors</Label>
                <p className="text-xs text-muted-foreground">Automatically detect and fix console errors</p>
              </div>
              <Switch
                id="autoFix"
                checked={localSettings.autoFix}
                onCheckedChange={(checked) => updateSetting('autoFix', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="autoRefactor">Auto Refactor</Label>
                <p className="text-xs text-muted-foreground">Suggest code improvements</p>
              </div>
              <Switch
                id="autoRefactor"
                checked={localSettings.autoRefactor}
                onCheckedChange={(checked) => updateSetting('autoRefactor', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="explainCode">Explain Code</Label>
                <p className="text-xs text-muted-foreground">Add explanations to generated code</p>
              </div>
              <Switch
                id="explainCode"
                checked={localSettings.explainCode}
                onCheckedChange={(checked) => updateSetting('explainCode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="addComments">Add Comments</Label>
                <p className="text-xs text-muted-foreground">Include helpful comments in code</p>
              </div>
              <Switch
                id="addComments"
                checked={localSettings.addComments}
                onCheckedChange={(checked) => updateSetting('addComments', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="testGeneration">Generate Tests</Label>
                <p className="text-xs text-muted-foreground">Create unit tests automatically</p>
              </div>
              <Switch
                id="testGeneration"
                checked={localSettings.testGeneration}
                onCheckedChange={(checked) => updateSetting('testGeneration', checked)}
              />
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold">Code Quality</h3>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="securityChecks">Security Checks</Label>
                <p className="text-xs text-muted-foreground">Scan for security vulnerabilities</p>
              </div>
              <Switch
                id="securityChecks"
                checked={localSettings.securityChecks}
                onCheckedChange={(checked) => updateSetting('securityChecks', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="performanceOptimization">Performance Optimization</Label>
                <p className="text-xs text-muted-foreground">Optimize for speed and efficiency</p>
              </div>
              <Switch
                id="performanceOptimization"
                checked={localSettings.performanceOptimization}
                onCheckedChange={(checked) => updateSetting('performanceOptimization', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="accessibility">Accessibility</Label>
                <p className="text-xs text-muted-foreground">Ensure WCAG compliance</p>
              </div>
              <Switch
                id="accessibility"
                checked={localSettings.accessibility}
                onCheckedChange={(checked) => updateSetting('accessibility', checked)}
              />
            </div>
          </div>

          <div className="space-y-2 border-t pt-4">
            <Label htmlFor="codeStyle">Code Style</Label>
            <Select
              value={localSettings.codeStyle}
              onValueChange={(value) => updateSetting('codeStyle', value as any)}
            >
              <SelectTrigger id="codeStyle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="functional">Functional (Modern, immutable)</SelectItem>
                <SelectItem value="oop">Object-Oriented (Class-based)</SelectItem>
                <SelectItem value="mixed">Mixed (Balanced approach)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="verbosity">Response Verbosity</Label>
            <Select
              value={localSettings.verbosity}
              onValueChange={(value) => updateSetting('verbosity', value as any)}
            >
              <SelectTrigger id="verbosity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concise">Concise (Brief explanations)</SelectItem>
                <SelectItem value="balanced">Balanced (Standard detail)</SelectItem>
                <SelectItem value="detailed">Detailed (Comprehensive explanations)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="framework">Preferred Framework</Label>
            <Input
              id="framework"
              placeholder="e.g., React, Vue, Angular"
              value={localSettings.framework}
              onChange={(e) => updateSetting('framework', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customInstructions">Custom Instructions</Label>
            <Textarea
              id="customInstructions"
              placeholder="Add any specific instructions for the AI agent..."
              rows={4}
              value={localSettings.customInstructions}
              onChange={(e) => updateSetting('customInstructions', e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1" data-testid="button-save-config">
              Save Configuration
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
