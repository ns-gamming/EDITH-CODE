import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { SiGooglegemini, SiOpenai, SiAnthropic } from "react-icons/si";
import type { ChatMessage, AIModel } from "@shared/schema";

interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (content: string, model: AIModel) => void;
  loading: boolean;
}

export function AIChat({ messages, onSendMessage, loading }: AIChatProps) {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<AIModel>("gemini-2.5-flash");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim() && !loading) {
      onSendMessage(input, selectedModel);
      setInput("");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getModelIcon = (model: string) => {
    if (model?.includes("gemini")) return <SiGooglegemini className="w-4 h-4" />;
    if (model?.includes("gpt")) return <SiOpenai className="w-4 h-4" />;
    if (model?.includes("claude")) return <SiAnthropic className="w-4 h-4" />;
    return <Sparkles className="w-4 h-4" />;
  };

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary gaming:glow-text" />
            AI Assistant
          </h3>
        </div>
        <Select value={selectedModel} onValueChange={(v) => setSelectedModel(v as AIModel)}>
          <SelectTrigger data-testid="select-ai-model">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gemini-2.5-flash" data-testid="option-gemini-flash">
              <div className="flex items-center gap-2">
                <SiGooglegemini className="w-4 h-4" />
                Gemini 2.5 Flash
              </div>
            </SelectItem>
            <SelectItem value="gemini-2.5-pro" data-testid="option-gemini-pro">
              <div className="flex items-center gap-2">
                <SiGooglegemini className="w-4 h-4" />
                Gemini 2.5 Pro
              </div>
            </SelectItem>
            <SelectItem value="gpt-5" data-testid="option-gpt5">
              <div className="flex items-center gap-2">
                <SiOpenai className="w-4 h-4" />
                GPT-5
              </div>
            </SelectItem>
            <SelectItem value="claude-sonnet-4-20250514" data-testid="option-claude">
              <div className="flex items-center gap-2">
                <SiAnthropic className="w-4 h-4" />
                Claude Sonnet 4
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-semibold mb-2">Start a conversation with EDITH</p>
              <p className="text-sm">Ask me to generate code, fix bugs, or explain concepts</p>
            </div>
          )}

          {messages.map((message, index) => (
            <Card
              key={index}
              className={`p-4 ${
                message.role === "user"
                  ? "bg-primary/10 ml-8"
                  : "bg-card mr-8"
              }`}
              data-testid={`message-${message.role}-${index}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${message.role === "assistant" ? "text-primary" : ""}`}>
                  {message.role === "assistant" ? (
                    getModelIcon(message.model || "")
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      U
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold">
                      {message.role === "assistant" ? "EDITH" : "You"}
                    </span>
                    {message.model && (
                      <span className="text-xs text-muted-foreground">
                        ({message.model})
                      </span>
                    )}
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {message.content}
                  </div>
                </div>
                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(message.content, message.id)}
                    data-testid={`button-copy-message-${index}`}
                  >
                    {copiedId === message.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            </Card>
          ))}

          {loading && (
            <Card className="p-4 bg-card mr-8">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">EDITH is thinking...</span>
              </div>
            </Card>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="Ask EDITH anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="min-h-[60px] max-h-[200px] resize-none"
            data-testid="input-ai-chat"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="self-end"
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
