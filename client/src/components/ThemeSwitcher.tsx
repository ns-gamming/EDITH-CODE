import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Gamepad2, Sun, Moon } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg" data-testid="theme-switcher">
      <Button
        variant={theme === "gaming" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("gaming")}
        className={`px-3 ${theme === "gaming" ? "gaming:glow-border" : ""}`}
        data-testid="button-theme-gaming"
      >
        <Gamepad2 className="w-4 h-4 mr-1" />
        Gaming
      </Button>
      <Button
        variant={theme === "white" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("white")}
        data-testid="button-theme-white"
      >
        <Sun className="w-4 h-4 mr-1" />
        Light
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="sm"
        onClick={() => setTheme("dark")}
        data-testid="button-theme-dark"
      >
        <Moon className="w-4 h-4 mr-1" />
        Dark
      </Button>
    </div>
  );
}
