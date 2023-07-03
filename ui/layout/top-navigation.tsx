import { GithubLogo, List, TwitterLogo } from "@phosphor-icons/react";

import { navigation } from "@/lib/navigation";
import { ThemeChanger } from "@/ui/layout/theme-changer";

import { ProfileSearch } from "../profile-search";
import { LensLogin } from "./lens-login";
import { Logo } from "./logo";
import { NavItem } from "./nav-item";

export function TopNavigation() {
  return (
    <div className="flex h-24 md:grid md:grid-cols-5 md:gap-7">
      <div className="flex items-center justify-center gap-2">
        <label
          htmlFor="drawer"
          className="btn-ghost drawer-button btn-square btn hidden"
        >
          <List size={25} />
        </label>
        <div className="items-center">
          <Logo />
        </div>
      </div>
      <div className="ml-0 flex items-center sm:ml-3 md:col-span-2 md:ml-0">
        <ProfileSearch />
      </div>
      <div className="flex w-full items-center justify-end gap-1 md:col-span-2 md:gap-4">
        <nav className="navbar">
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
        <a
          href="https://twitter.com/bartomolina"
          target="_blank"
          rel="noopener noreferrer"
        >
          <TwitterLogo size={25} alt="Twitter" />
        </a>
        <a
          href="https://github.com/bartomolina/premiere"
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
