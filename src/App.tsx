import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { layout, set } = useLocalStorage();
  const debouncedSet = useDebouncedCallback(set, 400);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="font-inter min-h-[100dvh] flex flex-col relative border rounded-lg w-full h-full bg-gray-50 px-6">
        <Header />
        <div className="flex h-full flex-1 pb-4">
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={(val) => debouncedSet("layout", val)}
          >
            <ResizablePanel minSize={40} defaultSize={layout?.[0]}>
              <Content />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel minSize={20} defaultSize={layout?.[1]}>
              <Panel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
