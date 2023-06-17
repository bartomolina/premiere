"use client";

import { ThemeChanger } from "@/ui/theme-changer";
import { SideNav } from "@/ui/side-navigation";
import { TopNavigation } from "@/ui/top-navigation";

export function Client({ children }: { children: React.ReactNode }) {
  return (
    <div className="drawer-mobile drawer bg-base-100">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <ThemeChanger />
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
