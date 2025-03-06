import { createTRPCReact } from '@trpc/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import React, { useState } from 'react';
import { env } from './env';

// Import the AppRouter type directly from your trpc package
import type { AppRouter } from '@repo/trpc';

/**
 * tRPC client for React components
 */
export const api = createTRPCReact<AppRouter>();

/**
 * Provider component for tRPC client
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      }
    }
  }));
  
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        httpBatchLink({
          url: `${env.EXPO_PUBLIC_SUPABASE_API_URL}trpc`,
          headers() {
            return {
              Authorization: `Bearer ${env.EXPO_PUBLIC_SUPABASE_API_ANON_KEY}`,
            };
          },
        }),
      ],
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </api.Provider>
  );
}
