import { QueryClient } from "@tanstack/react-query";

// Desktop app: no tabs to refocus, and Tauri commands aren't worth blind retries.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
