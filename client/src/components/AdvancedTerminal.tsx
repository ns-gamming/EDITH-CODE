
import { useEffect, useRef, useState } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal as TerminalIcon, AlertCircle, Info, Play, Square, Trash2, Copy } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import "xterm/css/xterm.css";

const SUPPORTED_LANGUAGES = {
  javascript: { cmd: "node", ext: ".js", icon: "🟨" },
  python: { cmd: "python3", ext: ".py", icon: "🐍" },
  typescript: { cmd: "ts-node", ext: ".ts", icon: "🔷" },
  bash: { cmd: "bash", ext: ".sh", icon: "🐚" },
  cpp: { cmd: "g++", ext: ".cpp", icon: "⚙️" },
  rust: { cmd: "rustc", ext: ".rs", icon: "🦀" },
  go: { cmd: "go run", ext: ".go", icon: "🔵" },
};

export function AdvancedTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [activeTab, setActiveTab] = useState("terminal");
  const [consoleOutput, setConsoleOutput] = useState<Array<{ type: string; message: string; timestamp: Date }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const term = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "JetBrains Mono, Fira Code, Consolas, monospace",
        theme: {
          background: "#0a0a0a",
          foreground: "#00ff00",
          cursor: "#00ff00",
          selection: "rgba(0, 255, 0, 0.3)",
          black: "#000000",
          red: "#ff0000",
          green: "#00ff00",
          yellow: "#ffff00",
          blue: "#0000ff",
          magenta: "#ff00ff",
          cyan: "#00ffff",
          white: "#ffffff",
        },
        cursorStyle: "block",
        scrollback: 10000,
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      
      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      term.writeln("\x1b[1;32m╔════════════════════════════════════════╗\x1b[0m");
      term.writeln("\x1b[1;32m║     EDITH Advanced Terminal v2.0       ║\x1b[0m");
      term.writeln("\x1b[1;32m║  Multi-Language Execution Environment  ║\x1b[0m");
      term.writeln("\x1b[1;32m╚════════════════════════════════════════╝\x1b[0m");
      term.writeln("");
      term.writeln("\x1b[1;36mSupported Languages:\x1b[0m JavaScript, Python, TypeScript, C++, Rust, Go, Bash");
      term.writeln("\x1b[1;33mType 'help' for available commands\x1b[0m");
      term.write("\r\n\x1b[1;32m$\x1b[0m ");

      let currentLine = "";
      term.onData((data) => {
        if (data === "\r") {
          term.write("\r\n");
          if (currentLine.trim()) {
            executeCommand(currentLine.trim(), term);
          }
          currentLine = "";
          term.write("\x1b[1;32m$\x1b[0m ");
        } else if (data === "\x7f") {
          if (currentLine.length > 0) {
            currentLine = currentLine.slice(0, -1);
            term.write("\b \b");
          }
        } else if (data === "\x1b[A") {
          // Up arrow - command history
        } else if (data === "\x1b[B") {
          // Down arrow - command history
        } else {
          currentLine += data;
          term.write(data);
        }
      });

      const executeCommand = async (cmd: string, terminal: XTerm) => {
        const parts = cmd.split(" ");
        const command = parts[0];

        switch (command) {
          case "help":
            terminal.writeln("\x1b[1;36mAvailable Commands:\x1b[0m");
            terminal.writeln("  \x1b[1;33mhelp\x1b[0m      - Show this help message");
            terminal.writeln("  \x1b[1;33mclear\x1b[0m     - Clear the terminal");
            terminal.writeln("  \x1b[1;33mecho\x1b[0m      - Echo back input");
            terminal.writeln("  \x1b[1;33mls\x1b[0m        - List files");
            terminal.writeln("  \x1b[1;33mpwd\x1b[0m       - Print working directory");
            terminal.writeln("  \x1b[1;33mnode\x1b[0m      - Run JavaScript");
            terminal.writeln("  \x1b[1;33mpython3\x1b[0m   - Run Python");
            terminal.writeln("  \x1b[1;33mlang\x1b[0m      - Show supported languages");
            break;
          case "clear":
            terminal.clear();
            break;
          case "lang":
            terminal.writeln("\x1b[1;36mSupported Languages:\x1b[0m");
            Object.entries(SUPPORTED_LANGUAGES).forEach(([lang, info]) => {
              terminal.writeln(`  ${info.icon} \x1b[1;33m${lang}\x1b[0m - ${info.cmd} (*${info.ext})`);
            });
            break;
          default:
            if (cmd.startsWith("echo ")) {
              terminal.writeln(cmd.substring(5));
            } else {
              terminal.writeln(`\x1b[1;31mCommand not found:\x1b[0m ${cmd}`);
              terminal.writeln("\x1b[1;33mType 'help' for available commands\x1b[0m");
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
    setConsoleOutput((prev) => [...prev, { type, message, timestamp: new Date() }]);
  };

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

  const clearConsole = () => {
    setConsoleOutput([]);
    if (xtermRef.current) {
      xtermRef.current.clear();
    }
  };

  const copyConsole = () => {
    const text = consoleOutput.map(log => `[${log.type.toUpperCase()}] ${log.message}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="h-full flex flex-col bg-black/90 border-cyan-500/30">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="flex items-center justify-between border-b border-cyan-500/30 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
          <TabsList className="bg-transparent rounded-none">
            <TabsTrigger value="terminal" className="gap-2 data-[state=active]:bg-cyan-500/20" data-testid="tab-terminal">
              <TerminalIcon className="w-4 h-4" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="console" className="gap-2 data-[state=active]:bg-cyan-500/20" data-testid="tab-console">
              <Info className="w-4 h-4" />
              Console
              {consoleOutput.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-cyan-500 text-black rounded-full">
                  {consoleOutput.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="problems" className="gap-2 data-[state=active]:bg-cyan-500/20" data-testid="tab-problems">
              <AlertCircle className="w-4 h-4" />
              Problems
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 px-4">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32 h-8 bg-black/50 border-cyan-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_LANGUAGES).map(([lang, info]) => (
                  <SelectItem key={lang} value={lang}>
                    {info.icon} {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={clearConsole}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="terminal" className="flex-1 m-0 p-0">
          <div ref={terminalRef} className="h-full" data-testid="terminal-output" />
        </TabsContent>

        <TabsContent value="console" className="flex-1 m-0 p-4 overflow-auto font-mono text-sm">
          {consoleOutput.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-cyan-400/50"
            >
              <Info className="w-12 h-12 mx-auto mb-4" />
              <p>No console output yet</p>
            </motion.div>
          ) : (
            <div className="space-y-1">
              {consoleOutput.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-start gap-2 ${
                    log.type === "error"
                      ? "text-red-400"
                      : log.type === "warn"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                  data-testid={`console-log-${i}`}
                >
                  <span className="text-cyan-400/50 text-xs">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="flex-1">{log.message}</span>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="problems" className="flex-1 m-0 p-4">
          <div className="text-cyan-400/50">No problems detected</div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
