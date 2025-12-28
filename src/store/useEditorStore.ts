import { create } from "zustand";

const DEFAULT_CODE = `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]
`;

export type MermaidTheme = "default" | "forest" | "neutral" | "base";
export type FlowDirection = "TD" | "TB" | "BT" | "LR" | "RL";

interface MermaidConfig {
  theme: MermaidTheme;
  direction: FlowDirection;
}

interface EditorState {
  code: string;
  debouncedCode: string;
  error: string | null;
  config: MermaidConfig;
  setCode: (code: string) => void;
  setDebouncedCode: (code: string) => void;
  setError: (error: string | null) => void;
  setTheme: (theme: MermaidTheme) => void;
  setDirection: (direction: FlowDirection) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  code: DEFAULT_CODE,
  debouncedCode: DEFAULT_CODE,
  error: null,
  config: {
    theme: "default",
    direction: "TD",
  },
  setCode: (code) => set({ code }),
  setDebouncedCode: (code) => set({ debouncedCode: code }),
  setError: (error) => set({ error }),
  setTheme: (theme) =>
    set((state) => ({ config: { ...state.config, theme } })),
  setDirection: (direction) =>
    set((state) => ({ config: { ...state.config, direction } })),
}));
