import { Moon, Sun, Download, Palette, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEditorStore, type MermaidTheme, type FlowDirection } from "@/store/useEditorStore";

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onExport: (format: "png" | "svg") => void;
}

const THEMES: { value: MermaidTheme; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "forest", label: "Forest" },
  { value: "neutral", label: "Neutral" },
  { value: "base", label: "Base" },
];

const DIRECTIONS: { value: FlowDirection; label: string }[] = [
  { value: "TD", label: "Top → Down" },
  { value: "LR", label: "Left → Right" },
  { value: "BT", label: "Bottom → Top" },
  { value: "RL", label: "Right → Left" },
];

export function Header({ isDark, onToggleTheme, onExport }: HeaderProps) {
  const { config, setTheme, setDirection } = useEditorStore();

  return (
    <header className="flex h-12 items-center justify-between border-b bg-card px-4">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">MermaidBetter</h1>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* Mermaid Theme */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">{THEMES.find(t => t.value === config.theme)?.label}</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Diagram theme</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Diagram Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {THEMES.map((theme) => (
                <DropdownMenuItem
                  key={theme.value}
                  onClick={() => setTheme(theme.value)}
                  className={config.theme === theme.value ? "bg-accent" : ""}
                >
                  {theme.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Flow Direction */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ArrowDown className="h-4 w-4" />
                    <span className="hidden sm:inline">{config.direction}</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Flow direction</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Flow Direction</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {DIRECTIONS.map((dir) => (
                <DropdownMenuItem
                  key={dir.value}
                  onClick={() => setDirection(dir.value)}
                  className={config.direction === dir.value ? "bg-accent" : ""}
                >
                  {dir.value} - {dir.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="mx-1 h-6 w-px bg-border" />

          {/* Export dropdown */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export diagram</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport("png")}>
                Export PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("svg")}>
                Export SVG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* App theme toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onToggleTheme}>
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDark ? "Light mode" : "Dark mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
}
