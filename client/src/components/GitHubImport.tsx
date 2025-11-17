import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { GitBranch, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GitHubImportProps {
  onImportComplete: (projectId: string) => void;
  userId: string;
}

export function GitHubImport({ onImportComplete, userId }: GitHubImportProps) {
  const [open, setOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImport = async () => {
    if (!repoUrl.trim()) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid GitHub repository URL',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (!match) {
        throw new Error('Invalid GitHub URL format');
      }

      const [, owner, repo] = match;
      const repoName = repo.replace(/\.git$/, '');

      const response = await fetch('/api/github/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repo: repoName, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to import repository');
      }

      const { projectId } = await response.json();

      toast({
        title: 'Import Successful!',
        description: `Successfully imported ${owner}/${repoName}`,
      });

      setOpen(false);
      setRepoUrl('');
      onImportComplete(projectId);
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
            className="w-full h-24 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30 hover:border-purple-500/50 transition-all"
          >
            <GitBranch className="w-8 h-8 text-purple-400" />
            <div className="text-center">
              <div className="font-semibold text-sm">Import from GitHub</div>
              <div className="text-xs text-muted-foreground">Clone any public repository</div>
            </div>
          </Button>
        </motion.div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Import from GitHub
          </DialogTitle>
          <DialogDescription>
            Enter a GitHub repository URL to import it as a new project
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="repo-url">Repository URL</Label>
            <Input
              id="repo-url"
              placeholder="https://github.com/username/repository"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && handleImport()}
            />
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Supported formats:</p>
            <ul className="list-disc list-inside ml-2">
              <li>https://github.com/owner/repo</li>
              <li>https://github.com/owner/repo.git</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleImport} className="flex-1" disabled={loading || !repoUrl.trim()}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Import
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
