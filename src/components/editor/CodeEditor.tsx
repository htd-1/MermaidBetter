import { useRef, useEffect } from "react";
import Editor, { OnMount, BeforeMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useEditorStore } from "@/store/useEditorStore";
import { useDebounce } from "@/hooks/useDebounce";
import { registerMermaidLanguage, mermaidLanguageId } from "@/lib/mermaid-language";

interface CodeEditorProps {
  isDark: boolean;
}

export function CodeEditor({ isDark }: CodeEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { code, setCode, setDebouncedCode } = useEditorStore();

  // Debounce code updates (500ms)
  useDebounce(code, 500, setDebouncedCode);

  const handleBeforeMount: BeforeMount = (monaco) => {
    registerMermaidLanguage(monaco);
  };

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Set initial theme
    monaco.editor.setTheme(isDark ? "mermaid-dark" : "mermaid-light");

    // Focus editor
    editor.focus();
  };

  // Update theme when isDark changes
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as unknown as { monaco?: typeof import("monaco-editor") }).monaco;
      if (monaco) {
        monaco.editor.setTheme(isDark ? "mermaid-dark" : "mermaid-light");
      }
    }
  }, [isDark]);

  return (
    <Editor
      height="100%"
      language={mermaidLanguageId}
      value={code}
      onChange={(value) => setCode(value ?? "")}
      beforeMount={handleBeforeMount}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        wordWrap: "on",
        automaticLayout: true,
        tabSize: 2,
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: "line",
        cursorBlinking: "smooth",
        smoothScrolling: true,
      }}
    />
  );
}
