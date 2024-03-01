import { Toaster } from "./components/ui/sonner";
import AdminMain from "./admin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ui/theme-provider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

export default function Admin() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="font-inter bg-primary-foreground min-h-[100dvh] flex flex-col relative border rounded-lg w-full h-full bg-gray-50 p-6">
          <AdminMain />
        </div>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
