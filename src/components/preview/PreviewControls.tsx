import { RotateCcw, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PreviewControlsProps {
  onReset: () => void;
  onCenter: () => void;
}

export function PreviewControls({ onReset, onCenter }: PreviewControlsProps) {
  return (
    <div className="absolute right-3 top-3 z-10 flex gap-1">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={onCenter}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Fit to view</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8"
              onClick={onReset}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Reset zoom</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
