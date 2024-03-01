import Header from "./components/header";
import Content from "./components/content";
import Panel from "./components/panel";
import { Toaster } from "./components/ui/sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { useLocalStorage } from "./lib/local-storage";
import useDebouncedCallback from "./lib/debounced-callback";
import { MutableRefObject } from "react";
import { Metadata } from "./state/panel";

type Props = {
  html: MutableRefObject<string>;
  htmlUrl: string;
  metadata: Metadata;
  saveImage: (name: string, blob: Blob) => Promise<string>;
};

function App({ htmlUrl, html, saveImage, metadata }: Props) {
  const { layout, set } = useLocalStorage();
  const debouncedSet = useDebouncedCallback(set, 400);

  return (
    <div className="font-inter min-h-[100dvh] flex flex-col relative border rounded-lg w-full h-full bg-gray-50 px-6">
      <Header />
      <div className="flex h-full flex-1 pb-4">
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(val) => debouncedSet("layout", val)}
        >
          <ResizablePanel minSize={40} defaultSize={layout?.[0]}>
            <Content htmlUrl={htmlUrl} html={html} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel minSize={20} defaultSize={layout?.[1]}>
            <Panel saveImage={saveImage} metadata={metadata} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
