import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";

import { navigation, type NavItem } from "@/lib/navigation";

export function SideNav() {
  return (
    <aside className="w-72 bg-base-200 h-full">
      <div className="p-6">
        <Link href={"/"}>
          <div className="flex text-2xl gap-1">
            ⬛️
            <div>
              <span className="font-bold text-primary">App</span>
              <span className="font-normal text-base-content">Boilerplate</span>
            </div>
          </div>
        </Link>
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
        clsx({
          "rounded-none": true,
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
