import Header from "./components/header";
import Panel from "./components/panel";
import { Toaster } from "./components/ui/sonner";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { useLocalStorage } from "./lib/local-storage";
import useDebouncedCallback from "./lib/debounced-callback";
import { Metadata, usePanel } from "./state/panel";
import { ScrollArea } from "./components/ui/scroll-area";
import { useExtra, Extra } from "./state/extra";
import { lazy, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = Partial<{
  onSubmit: (data: any) => void;
  url: string;
  metadata: Metadata;
  stylingMetadata: Metadata;
  saveImage: (name: string, blob: Blob) => Promise<string>;
  extra: Extra["state"];
}>;

const Content = lazy(() => import("./components/content"));
const WidgetContent = lazy(() => import("./components/content/widget"));

const mockExtras = {
  isWidget: true,
  widgetConfigurationId: "88dd4c4d-8537-4a52-8fa7-8f9e35be65d1",
  variables: {
    "main-color": "#481453",
  },
};

function App({
  url: htmlUrl,
  onSubmit,
  saveImage,
  metadata,
  stylingMetadata,
  extra,
}: Props) {
  const { layout, set } = useLocalStorage();
  const debouncedSet = useDebouncedCallback(set, 400);
  const [loaded, setLoaded] = useState(false);
  const [extraState, setExtra] = useExtra(
    useShallow((state) => [state.state, state.set]),
  );
  const setSaveFn = usePanel(useShallow((state) => state.setSaveImgFn));

  useEffect(() => {
    if (saveImage) setSaveFn(saveImage);
  }, []);

  useEffect(() => {
    extra && setExtra(extra);
    // setExtra(mockExtras);
    setLoaded(true);
  }, [extra]);

  if (!loaded) return null;

  return (
    <div className="font-inter flex flex-col relative border rounded-lg w-full h-full bg-gray-50">
      <Header isWidget={extraState?.isWidget} />
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(val) => debouncedSet("layout", val)}
        className="flex flex-grow relative"
      >
        <ResizablePanel minSize={60} defaultSize={layout?.[0]}>
          {extraState?.isWidget ? (
            <WidgetContent
              configurationId={extraState?.widgetConfigurationId as string}
              onSubmit={onSubmit}
            />
          ) : (
            <Content htmlUrl={htmlUrl} setHtml={onSubmit} />
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          minSize={30}
          defaultSize={layout?.[1]}
          className="bg-[#F0EDF4] rounded-r-2xl"
        >
          <ScrollArea className="h-[calc(100dvh-72px)]">
            <Panel metadata={metadata ?? stylingMetadata} />
          </ScrollArea>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Toaster />
    </div>
  );
}

export default App;
