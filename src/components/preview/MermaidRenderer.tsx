import { useEffect, useRef, useState, useCallback } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEditorStore } from "@/store/useEditorStore";
import { initMermaid, renderMermaid, applyDirection } from "@/lib/mermaid-config";
import { PreviewControls } from "./PreviewControls";
import { AlertCircle } from "lucide-react";

export function MermaidRenderer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const renderIdRef = useRef(0);
  const { debouncedCode, config, error, setError } = useEditorStore();

  // Render diagram when code or config changes
  useEffect(() => {
    const currentRenderId = ++renderIdRef.current;

    async function render() {
      if (!debouncedCode.trim()) {
        setSvg("");
        setError(null);
        return;
      }

      // Initialize mermaid with theme
      initMermaid(config.theme);

      // Apply direction to the code
      const processedCode = applyDirection(debouncedCode, config.direction);

      const result = await renderMermaid(
        processedCode,
        `mermaid-${currentRenderId}`
      );

      // Check if this is still the latest render
      if (currentRenderId !== renderIdRef.current) return;

      if ("error" in result) {
        setError(result.error);
      } else {
        setSvg(result.svg);
        setError(null);
      }
    }

    render();
  }, [debouncedCode, config.theme, config.direction, setError]);

  const handleResetTransform = useCallback((resetFn: () => void) => {
    resetFn();
  }, []);

  return (
    <div className="relative h-full w-full" ref={containerRef}>
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={4}
        centerOnInit
        wheel={{ step: 0.1 }}
      >
        {({ resetTransform, centerView }) => (
          <>
            <PreviewControls
              onReset={() => handleResetTransform(resetTransform)}
              onCenter={() => centerView(1)}
            />
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
              }}
              contentStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100%",
                minWidth: "100%",
              }}
            >
              {svg ? (
                <div
                  className="mermaid-output p-8"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              ) : (
                <div className="text-muted-foreground">
                  {debouncedCode.trim() ? "Rendering..." : "Enter Mermaid code"}
                </div>
              )}
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      {/* Error overlay */}
      {error && (
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-destructive/50 bg-destructive/10 p-3 backdrop-blur-sm">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="flex-1 overflow-auto">
              <p className="text-sm font-medium text-destructive">
                Syntax Error
              </p>
              <pre className="mt-1 max-h-24 overflow-auto text-xs text-destructive/80">
                {error}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
