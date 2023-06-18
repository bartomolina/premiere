import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { Logo } from "./logo";
import { useSelectedLayoutSegment } from "next/navigation";

import { navigation, type NavItem } from "@/lib/navigation";

export function SideNav() {
  return (
    <aside className="w-72 bg-base-200 h-full">
      <div className="flex h-20 px-6 items-center">
        <Logo />
      </div>
      {navigation.map((section) => (
        <ul key={section.name} className="menu px-0">
          <li className="menu-title">{section.name}</li>
          {section.items.map((item) => (
            <li key={item.name}>
              <GlobalNavItem key={item.slug} item={item} />
            </li>
          ))}
        </ul>
      ))}
    </aside>
  );
}

function GlobalNavItem({ item }: { item: NavItem }) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      href={`/${item.slug}`}
      className={twMerge(
        "rounded-none",
        clsx({
          "font-semibold": isActive,
        })
      )}
    >
      {item.name}
      {isActive && (
        <span className="absolute inset-y-0 left-0 w-1 rounded-r-md bg-primary" />
      )}
    </Link>
  );
}
