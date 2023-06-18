"use client";

import { SideNav } from "@/ui/layout/side-navigation";
import { TopNavigation } from "@/ui/layout/top-navigation";

export function Client({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <TopNavigation />
        <div className="px-6 pb-16 xl:pr-2">{children}</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay" />
        <SideNav />
      </div>
    </div>
  );
}
