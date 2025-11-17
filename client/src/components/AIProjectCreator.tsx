import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AIProjectCreatorProps {
  onProjectCreate: (projectId: string) => void;
  userId: string;
}

export function AIProjectCreator({ onProjectCreate, userId }: AIProjectCreatorProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [framework, setFramework] = useState('react');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const frameworks = [
    { value: 'react', label: 'React + Vite' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'vanilla', label: 'Vanilla HTML/CSS/JS' },
    { value: 'node', label: 'Node.js Backend' },
    { value: 'python', label: 'Python Flask' },
  ];

  const handleCreate = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Invalid Prompt',
        description: 'Please describe what you want to build',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/projects/ai-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId, 
          prompt,
          framework 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const { projectId } = await response.json();

      toast({
        title: 'Project Created!',
        description: 'AI is generating your project files...',
      });

      setOpen(false);
      setPrompt('');
      onProjectCreate(projectId);
    } catch (error) {
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'Build a todo app with dark mode',
    'Create a weather dashboard',
    'Make a calculator with history',
    'Build a portfolio website',
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full"
        >
          <Button 
            variant="outline" 
            className="w-full h-24 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border-cyan-500/30 hover:border-cyan-500/50 transition-all"
          >
            <Wand2 className="w-8 h-8 text-cyan-400" />
            <div className="text-center">
              <div className="font-semibold text-sm">AI Project Generator</div>
              <div className="text-xs text-muted-foreground">Describe what you want to build</div>
            </div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Create Project with AI
          </DialogTitle>
          <DialogDescription>
            Describe your project idea and let AI generate the initial code structure
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="framework">Framework</Label>
            <Select value={framework} onValueChange={setFramework}>
              <SelectTrigger id="framework">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map((f) => (
                  <SelectItem key={f.value} value={f.value}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt">Project Description</Label>
            <Textarea
              id="prompt"
              placeholder="Example: Build a task management app with drag and drop functionality, dark mode support, and local storage..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Suggestions:</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="flex-1" disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Project
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
