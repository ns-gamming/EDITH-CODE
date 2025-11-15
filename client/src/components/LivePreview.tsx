import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink, Smartphone, Monitor } from "lucide-react";
import type { File } from "@shared/schema";

interface LivePreviewProps {
  files: File[];
  autoRefresh?: boolean;
}

export function LivePreview({ files, autoRefresh = true }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (autoRefresh) {
      updatePreview();
    }
  }, [files, autoRefresh]);

  const updatePreview = () => {
    if (!iframeRef.current) return;

    const htmlFile = files.find((f) => f.name.endsWith(".html") || f.language === "html");
    const cssFile = files.find((f) => f.name.endsWith(".css") || f.language === "css");
    const jsFile = files.find((f) => f.name.endsWith(".js") || f.language === "javascript");

    let html = htmlFile?.content || "<html><body><h1>No HTML file found</h1></body></html>";
    
    // Inject CSS
    if (cssFile) {
      html = html.replace(
        "</head>",
        `<style>${cssFile.content}</style></head>`
      );
    }

    // Inject JS
    if (jsFile) {
      html = html.replace(
        "</body>",
        `<script>${jsFile.content}</script></body>`
      );
    }

    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  };

  const openInNewTab = () => {
    const htmlFile = files.find((f) => f.name.endsWith(".html") || f.language === "html");
    if (htmlFile) {
      const blob = new Blob([htmlFile.content], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <h3 className="font-semibold text-sm">Live Preview</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileView(!isMobileView)}
            data-testid="button-toggle-view"
          >
            {isMobileView ? (
              <Smartphone className="w-4 h-4" />
            ) : (
              <Monitor className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={updatePreview}
            data-testid="button-refresh-preview"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInNewTab}
            data-testid="button-open-new-tab"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-muted p-4 flex items-center justify-center overflow-auto">
        <div
          className={`bg-background rounded-lg shadow-lg transition-all ${
            isMobileView ? "w-[375px] h-[667px]" : "w-full h-full"
          }`}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full rounded-lg"
            sandbox="allow-scripts allow-same-origin"
            title="Live Preview"
            data-testid="iframe-preview"
          />
        </div>
      </div>
    </Card>
  );
}
