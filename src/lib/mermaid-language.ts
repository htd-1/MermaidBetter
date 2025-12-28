import type { languages } from "monaco-editor";

export const mermaidLanguageId = "mermaid";

export const mermaidLanguageConfig: languages.LanguageConfiguration = {
  comments: {
    lineComment: "%%",
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],
};

export const mermaidTokensProvider: languages.IMonarchLanguage = {
  defaultToken: "",
  tokenPostfix: ".mermaid",

  keywords: [
    "graph", "flowchart", "sequenceDiagram", "classDiagram", "stateDiagram",
    "stateDiagram-v2", "erDiagram", "journey", "gantt", "pie", "quadrantChart",
    "requirementDiagram", "gitGraph", "mindmap", "timeline", "sankey-beta",
    "xychart-beta", "block-beta",
    "subgraph", "end", "direction",
    "participant", "actor", "activate", "deactivate", "note", "loop", "alt",
    "else", "opt", "par", "and", "critical", "break", "rect", "autonumber",
    "class", "state", "title", "section", "dateFormat", "axisFormat",
    "excludes", "includes", "todayMarker",
    "LR", "RL", "TB", "TD", "BT",
  ],

  typeKeywords: [
    "string", "int", "float", "boolean",
  ],

  operators: [
    "-->", "---", "-.->", "-.-", "==>", "===", "--x", "--o",
    "->", "<->", "<-->", "->>", "<<->>", "-))", "-)",
    "|>", "<|", "||--", "}|", "|{", "||--|{",
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,

  tokenizer: {
    root: [
      // Comments
      [/%%.*$/, "comment"],

      // Diagram type declarations
      [/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|stateDiagram-v2|erDiagram|journey|gantt|pie|quadrantChart|requirementDiagram|gitGraph|mindmap|timeline|sankey-beta|xychart-beta|block-beta)\b/, "keyword.declaration"],

      // Direction keywords
      [/\b(LR|RL|TB|TD|BT)\b/, "keyword.direction"],

      // Subgraph
      [/\b(subgraph|end)\b/, "keyword.control"],

      // Keywords
      [/\b(participant|actor|activate|deactivate|note|loop|alt|else|opt|par|and|critical|break|rect|autonumber|class|state|title|section|dateFormat|axisFormat|excludes|includes|todayMarker|direction)\b/, "keyword"],

      // Node shapes with text
      [/\[\[([^\]]*)\]\]/, "string.node"],
      [/\(\(([^)]*)\)\)/, "string.node"],
      [/\[\(([^)]*)\)\]/, "string.node"],
      [/\[\{([^}]*)\}\]/, "string.node"],
      [/\(\[([^\]]*)\]\)/, "string.node"],
      [/\[([^\]]*)\]/, "string.node"],
      [/\(([^)]*)\)/, "string.node"],
      [/\{([^}]*)\}/, "string.node"],

      // Arrows and links
      [/-->|---|-\.->|-\.-|==>|===|--x|--o|->|<->|<-->|->>|<<->>|-\)\)|<-\)|x--|o--/, "operator"],
      [/\|([^|]*)\|/, "string.label"],

      // Strings
      [/"([^"]*)"/, "string"],
      [/'([^']*)'/, "string"],

      // Node identifiers
      [/[A-Za-z_][A-Za-z0-9_]*/, "identifier"],

      // Numbers
      [/\d+/, "number"],

      // Whitespace
      [/\s+/, "white"],
    ],
  },
};

export const mermaidThemeLight: Record<string, string> = {
  "keyword": "#0000FF",
  "keyword.declaration": "#AF00DB",
  "keyword.control": "#0000FF",
  "keyword.direction": "#795E26",
  "string": "#A31515",
  "string.node": "#001080",
  "string.label": "#098658",
  "comment": "#008000",
  "operator": "#000000",
  "identifier": "#001080",
  "number": "#098658",
};

export const mermaidThemeDark: Record<string, string> = {
  "keyword": "#569CD6",
  "keyword.declaration": "#C586C0",
  "keyword.control": "#569CD6",
  "keyword.direction": "#DCDCAA",
  "string": "#CE9178",
  "string.node": "#9CDCFE",
  "string.label": "#B5CEA8",
  "comment": "#6A9955",
  "operator": "#D4D4D4",
  "identifier": "#9CDCFE",
  "number": "#B5CEA8",
};

export function registerMermaidLanguage(monaco: typeof import("monaco-editor")) {
  // Register language
  monaco.languages.register({ id: mermaidLanguageId });

  // Set language configuration
  monaco.languages.setLanguageConfiguration(mermaidLanguageId, mermaidLanguageConfig);

  // Set tokenizer
  monaco.languages.setMonarchTokensProvider(mermaidLanguageId, mermaidTokensProvider);

  // Define light theme
  monaco.editor.defineTheme("mermaid-light", {
    base: "vs",
    inherit: true,
    rules: Object.entries(mermaidThemeLight).map(([token, foreground]) => ({
      token: `${token}.mermaid`,
      foreground: foreground.replace("#", ""),
    })),
    colors: {},
  });

  // Define dark theme
  monaco.editor.defineTheme("mermaid-dark", {
    base: "vs-dark",
    inherit: true,
    rules: Object.entries(mermaidThemeDark).map(([token, foreground]) => ({
      token: `${token}.mermaid`,
      foreground: foreground.replace("#", ""),
    })),
    colors: {},
  });
}
