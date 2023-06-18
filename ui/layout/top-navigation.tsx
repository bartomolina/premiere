import { List } from "@phosphor-icons/react";
import { ThemeChanger } from "@/ui/layout/theme-changer";
import { Logo } from "./logo";
import { GithubLogo } from "@phosphor-icons/react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { navigation, type NavItem } from "@/lib/navigation";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

export function TopNavigation({ dashboard = false }: { dashboard?: boolean }) {
  return (
    <div className="flex h-20 px-6 justify-center">
      <nav className="navbar p-0">
        <div className="flex flex-1 gap-2">
          <label
            htmlFor="drawer"
            className="btn-ghost btn-square btn drawer-button lg:hidden"
          >
            <List size={25} />
          </label>
          <div
            className={twMerge(
              clsx({
                "lg:hidden": dashboard,
              })
            )}
          >
            <Logo />
          </div>
        </div>
        {!dashboard && (
          <div className="navbar ml-5">
            {navigation.map((section) => (
              <ul key={section.name} className="menu menu-horizontal gap-5">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <GlobalNavItem key={item.slug} item={item} />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        )}
        <div className="gap-2">
          <a
            href="https://www.github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubLogo size={25} alt="GitHub" />
          </a>
          <ThemeChanger />
        </div>
      </nav>
    </div>
  );
}

function GlobalNavItem({ item }: { item: NavItem }) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      href={`/${item.slug}`}
      className={twMerge(
        "rounded-none hover:bg-inherit px-0 py-2",
        clsx({
          "font-semibold border-b-2 border-primary": isActive,
        })
      )}
    >
      {item.name}
    </Link>
  );
}
