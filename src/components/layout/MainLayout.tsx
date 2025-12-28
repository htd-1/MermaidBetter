import { ReactNode } from "react";
import { Group, Panel, Separator } from "react-resizable-panels";

interface MainLayoutProps {
  header: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
}

export function MainLayout({ header, editor, preview }: MainLayoutProps) {
  return (
    <div className="flex h-full flex-col">
      {header}
      <Group orientation="horizontal" className="flex-1">
        <Panel id="editor" defaultSize={50} minSize={20}>
          <div className="h-full overflow-hidden bg-card">{editor}</div>
        </Panel>
        <Separator className="w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize" />
        <Panel id="preview" defaultSize={50} minSize={20}>
          <div className="h-full overflow-hidden bg-muted/30">{preview}</div>
        </Panel>
      </Group>
    </div>
  );
}
