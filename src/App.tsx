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
import { Metadata } from "./state/panel";
import { ScrollArea } from "./components/ui/scroll-area";

type Props = Partial<{
  setHtml: (html: string) => void;
  url: string;
  metadata: Metadata;
  stylingMetadata: Metadata;
  logoUrl: string;
  saveImage: (name: string, blob: Blob) => Promise<string>;
}>;

function App({
  url: htmlUrl,
  setHtml,
  saveImage,
  metadata,
  stylingMetadata,
  logoUrl,
}: Props) {
  const { layout, set } = useLocalStorage();
  const debouncedSet = useDebouncedCallback(set, 400);

  return (
    <div className="font-inter min-h-[100dvh] flex flex-col relative border rounded-lg w-full h-full bg-gray-50">
      <Header />
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(val) => debouncedSet("layout", val)}
        className="flex flex-grow relative"
      >
        <ResizablePanel minSize={60} defaultSize={layout?.[0]}>
          <Content htmlUrl={htmlUrl} setHtml={setHtml} logoUrl={logoUrl} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          minSize={20}
          defaultSize={layout?.[1]}
          className="bg-[#F0EDF4] rounded-r-2xl"
        >
          <ScrollArea className="h-[calc(100dvh-72px)]">
            <Panel
              saveImage={saveImage}
              metadata={metadata ?? stylingMetadata}
            />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster />
    </div>
  );
}

export default App;
