"use client";

import { LensProvider } from "@lens-protocol/react-web";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { ToastContainer } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { WagmiConfig } from "wagmi";

import { lensConfig } from "@/lib/lens-config";
import { wagmiClient } from "@/lib/wagmi-client";
import { SideNav } from "@/ui/layout/side-navigation";
import { TopNavigation } from "@/ui/layout/top-navigation";

export function Client({
  children,
  dashboard = false,
}: {
  children: React.ReactNode;
  dashboard?: boolean;
}) {
  const { theme } = useTheme();

  return (
    <div
      className={twMerge(
        clsx({
          "mx-auto max-w-5xl": !dashboard,
        })
      )}
    >
      <div
        className={twMerge(
          clsx({
            drawer: true,
            "lg:drawer-open": dashboard,
          })
        )}
      >
        <input id="drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          <WagmiConfig client={wagmiClient}>
            <LensProvider config={lensConfig}>
              <div
                className={twMerge(
                  "lg:px-0 px-3",
                  clsx({
                    "px-6": dashboard,
                  })
                )}
              >
                <TopNavigation dashboard={dashboard} />
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
