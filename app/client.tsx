"use client";

import { LensProvider } from "@lens-protocol/react-web";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";

import { lensConfig } from "@/lib/lens-config";
import { wagmiConfig } from "@/lib/wagmi-client";
import { SideNav } from "@/ui/layout/side-navigation";
import { TopNavigation } from "@/ui/layout/top-navigation";

export function Client({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div className="mx-auto max-w-5xl">
      <div className="drawer">
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <WagmiConfig config={wagmiConfig}>
            <LensProvider config={lensConfig}>
              <div className="px-3 lg:px-0">
                <TopNavigation />
                {children}
              </div>
            </LensProvider>
          </WagmiConfig>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay" />
          <SideNav />
        </div>
      </div>
      <ToastContainer theme={theme === "light" ? "light" : "dark"} />
    </div>
  );
}
