import mermaid from "mermaid";
import type { MermaidTheme, FlowDirection } from "@/store/useEditorStore";

export function initMermaid(theme: MermaidTheme) {
  mermaid.initialize({
    startOnLoad: false,
    theme: theme,
    securityLevel: "loose",
    flowchart: {
      useMaxWidth: true,
      htmlLabels: false,
      curve: "basis",
    },
    sequence: {
      useMaxWidth: true,
      diagramMarginX: 50,
      diagramMarginY: 10,
    },
    gantt: {
      useMaxWidth: true,
    },
  });
}

// Apply direction to flowchart/graph code
export function applyDirection(code: string, direction: FlowDirection): string {
  let result = code;

  // Replace existing direction
  result = result.replace(/^(\s*)(flowchart|graph)\s+(TD|TB|BT|LR|RL)/gm, `$1$2 ${direction}`);

  // Add direction if missing (flowchart/graph without direction)
  result = result.replace(/^(\s*)(flowchart|graph)\s*$/gm, `$1$2 ${direction}`);

  return result;
}

export async function renderMermaid(
  code: string,
  elementId: string
): Promise<{ svg: string } | { error: string }> {
  try {
    // Validate syntax first
    await mermaid.parse(code);

    // Render diagram
    const { svg } = await mermaid.render(elementId, code);
    return { svg };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { error: message };
  }
}
