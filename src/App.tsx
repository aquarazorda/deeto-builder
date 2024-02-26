import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "./components/header";
import Content from "./components/content";
import Panel from "./components/panel";

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
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-[100dvh] flex flex-col relative border rounded-lg w-full h-full bg-gray-50 px-6">
        <Header />
        <div className="flex h-full flex-1 pb-4">
          <Content />
          <Panel />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
