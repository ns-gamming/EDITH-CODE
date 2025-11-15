import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal as TerminalIcon, AlertCircle, Info } from "lucide-react";
import "xterm/css/xterm.css";

export function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [activeTab, setActiveTab] = useState("terminal");
  const [consoleOutput, setConsoleOutput] = useState<Array<{ type: string; message: string }>>([]);

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        theme: {
          background: "#0a0a0a",
          foreground: "#f0f0f0",
        },
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln("Welcome to EDITH Terminal");
      term.writeln("Type 'help' for available commands");
      term.write("\r\n$ ");

      let currentLine = "";
      term.onData((data) => {
        if (data === "\r") {
          term.write("\r\n");
          if (currentLine.trim()) {
            executeCommand(currentLine.trim());
          }
          currentLine = "";
          term.write("$ ");
        } else if (data === "\x7f") {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write("\b \b");
          }
        } else {
          currentLine += data;
          term.write(data);
        }
      });

      const executeCommand = (cmd: string) => {
        switch (cmd) {
          case "help":
            term.writeln("Available commands:");
            term.writeln("  help  - Show this help message");
            term.writeln("  clear - Clear the terminal");
            term.writeln("  echo  - Echo back the input");
            break;
          case "clear":
            term.clear();
            break;
          default:
            if (cmd.startsWith("echo ")) {
              term.writeln(cmd.substring(5));
            } else {
              term.writeln(`Command not found: ${cmd}`);
            }
        }
      };

      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      const handleResize = () => {
        fitAddon.fit();
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        term.dispose();
      };
    }
  }, []);

  const addConsoleLog = (type: string, message: string) => {
    setConsoleOutput((prev) => [...prev, { type, message }]);
  };

  // Expose console logging to window for capturing logs
  useEffect(() => {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      originalLog(...args);
      addConsoleLog("log", args.join(" "));
    };

    console.error = (...args) => {
      originalError(...args);
      addConsoleLog("error", args.join(" "));
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addConsoleLog("warn", args.join(" "));
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <Card className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="terminal" className="gap-2" data-testid="tab-terminal">
            <TerminalIcon className="w-4 h-4" />
            Terminal
          </TabsTrigger>
          <TabsTrigger value="console" className="gap-2" data-testid="tab-console">
            <Info className="w-4 h-4" />
            Console
          </TabsTrigger>
          <TabsTrigger value="problems" className="gap-2" data-testid="tab-problems">
            <AlertCircle className="w-4 h-4" />
            Problems
          </TabsTrigger>
        </TabsList>

        <TabsContent value="terminal" className="flex-1 m-0 p-0">
          <div ref={terminalRef} className="h-full" data-testid="terminal-output" />
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0 p-4 overflow-auto">
          <div className="space-y-1 font-mono text-sm">
            {consoleOutput.length === 0 ? (
              <p className="text-muted-foreground">No console output yet</p>
            ) : (
              consoleOutput.map((log, i) => (
                <div
                  key={i}
                  className={`${
                    log.type === "error"
                      ? "text-destructive"
                      : log.type === "warn"
                      ? "text-yellow-500"
                      : "text-foreground"
                  }`}
                  data-testid={`console-log-${i}`}
                >
                  {log.message}
                </div>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="problems" className="flex-1 m-0 p-4">
          <div className="text-muted-foreground">No problems detected</div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
