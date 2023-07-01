import { GithubLogo, List } from "@phosphor-icons/react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { navigation } from "@/lib/navigation";
import { ThemeChanger } from "@/ui/layout/theme-changer";

import { ProfileSearch } from "../profile-search";
import { LensLogin } from "./lens-login";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";

export function TopNavigation({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <div className="flex h-24 items-center p-0">
      <div className="flex items-center gap-2">
        <label
          htmlFor="drawer"
          className="btn-ghost drawer-button btn-square btn hidden"
        >
          <List size={25} />
        </label>
        <div
          className={twMerge(
            "flex items-center gap-5",
            clsx({
              "lg:hidden": dashboard,
            })
          )}
        >
          <Logo />
          <ProfileSearch />
        </div>
      </div>
      {!dashboard && (
        <nav className="navbar pl-8">
          {navigation.map((section) => (
            <ul key={section.name} className="menu menu-horizontal gap-5">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavItem key={item.slug} item={item} />
                </li>
              ))}
            </ul>
          ))}
        </nav>
      )}
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/bartomolina/m0saic"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubLogo size={25} alt="GitHub" />
        </a>
        <ThemeChanger />
        <LensLogin />
      </div>
    </div>
  );
}
