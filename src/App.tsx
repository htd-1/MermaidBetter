import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { MermaidRenderer } from "@/components/preview/MermaidRenderer";
import { useTheme } from "@/hooks/useTheme";
import { exportPng, exportSvg, getSvgFromPreview } from "@/lib/export";

function App() {
  const { isDark, toggle } = useTheme();

  const handleExport = async (format: "png" | "svg") => {
    const svgContent = getSvgFromPreview();
    if (!svgContent) {
      console.error("No diagram to export");
      return;
    }

    if (format === "svg") {
      await exportSvg(svgContent);
    } else {
      await exportPng(svgContent);
    }
  };

  return (
    <MainLayout
      header={
        <Header isDark={isDark} onToggleTheme={toggle} onExport={handleExport} />
      }
      editor={<CodeEditor isDark={isDark} />}
      preview={<MermaidRenderer />}
    />
  );
}

export default App;
