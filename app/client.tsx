"use client";

import { SideNav } from "@/ui/layout/side-navigation";
import { TopNavigation } from "@/ui/layout/top-navigation";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function Client({
  children,
  dashboard = false,
}: {
  children: React.ReactNode;
  dashboard?: boolean;
}) {
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
          <TopNavigation dashboard={dashboard} />
          <div className="px-6">{children}</div>
        </div>
        <div className="drawer-side">
          <label htmlFor="drawer" className="drawer-overlay" />
          <SideNav />
        </div>
      </div>
    </div>
  );
}
