import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Image, X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  onFilesUpload: (files: File[]) => void;
  onFileAnalyze?: (file: File) => void;
  maxFiles?: number;
}

export function FileUpload({ onFilesUpload, onFileAnalyze, maxFiles = 10 }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{ file: File; preview?: string }[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const filesWithPreviews = acceptedFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return {
          file,
          preview: URL.createObjectURL(file),
        };
      }
      return { file };
    });

    setUploadedFiles((prev) => [...prev, ...filesWithPreviews]);
    onFilesUpload(acceptedFiles);
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'text/*': ['.txt', '.md', '.csv'],
      'application/json': ['.json'],
      'application/javascript': ['.js'],
      'text/javascript': ['.js'],
      'text/html': ['.html'],
      'text/css': ['.css'],
    },
  });

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const analyzeFile = async (file: File) => {
    if (onFileAnalyze) {
      setAnalyzing(true);
      try {
        await onFileAnalyze(file);
      } finally {
        setAnalyzing(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed cursor-pointer transition-all p-8 ${
          isDragActive ? "border-primary bg-primary/5" : "border-border hover-elevate"
        }`}
        data-testid="dropzone-upload"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className={`w-12 h-12 mb-4 ${isDragActive ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-lg font-semibold mb-2">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse (images, code files)
          </p>
          <Button variant="outline" size="sm">
            Browse Files
          </Button>
        </div>
      </Card>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Uploaded Files</h4>
          {uploadedFiles.map((item, index) => (
            <Card key={index} className="p-4" data-testid={`uploaded-file-${index}`}>
              <div className="flex items-center gap-4">
                {item.preview ? (
                  <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                    <img
                      src={item.preview}
                      alt={item.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(item.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>

                <div className="flex gap-2">
                  {item.file.type.startsWith("image/") && onFileAnalyze && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => analyzeFile(item.file)}
                      disabled={analyzing}
                      data-testid={`button-analyze-file-${index}`}
                    >
                      {analyzing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Analyze"
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    data-testid={`button-remove-file-${index}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
