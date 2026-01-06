"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

/**
 * Providers Component
 *
 * Wraps the application with TanStack Query (React Query) provider.
 * This enables client-side caching, background refetching, and optimistic updates.
 *
 * Configuration:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - gcTime: 10 minutes - Unused data is garbage collected after 10 minutes
 * - refetchOnWindowFocus: true - Refetch when user returns to the tab
 * - refetchOnReconnect: true - Refetch when internet reconnects
 */
export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient inside component to avoid sharing between requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data is considered fresh for 5 minutes
            // This means useQuery won't refetch automatically during this time
            staleTime: 5 * 60 * 1000, // 5 minutes

            // How long inactive data stays in cache before garbage collection
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)

            // Automatically refetch when user focuses the window
            // Great for keeping data fresh when user returns to the tab
            refetchOnWindowFocus: true,

            // Refetch when internet connection is restored
            refetchOnReconnect: true,

            // Retry failed requests once
            retry: 1,

            // Don't refetch on mount if data is still fresh
            refetchOnMount: false,
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* React Query Devtools - only loads in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
