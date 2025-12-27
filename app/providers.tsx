"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MusicProvider } from "@/context/MusicContext";
import { useState } from "react";
import HamburgerMenuWrapper from "@/components/HamburgerMenuWrapper";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MusicProvider>
        <HamburgerMenuWrapper />
        {children}
      </MusicProvider>
    </QueryClientProvider>
  );
}

