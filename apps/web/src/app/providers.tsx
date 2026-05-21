"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import type { ReactNode } from "react";

export function AppProviders({ children }: { children: ReactNode }) {
  const manifestUrl =
    process.env.NEXT_PUBLIC_TONCONNECT_MANIFEST_URL ||
    "https://case-platform-web.onrender.com/tonconnect-manifest.json";
  const twaReturnUrl = (process.env.NEXT_PUBLIC_TWA_RETURN_URL ||
    "https://t.me/case_official_bot") as `${string}://${string}`;

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl} actionsConfiguration={{ twaReturnUrl }}>
      {children}
    </TonConnectUIProvider>
  );
}
