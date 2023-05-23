"use client";

import Link from "next/link";
import { navigation, type NavItem } from "@/lib/navigation";
import { useSelectedLayoutSegment } from "next/navigation";
import clsx from "clsx";

export function SideNav() {
  return (
    <aside className="w-80 bg-base-200">
      <div className="flex items-center gap-2 px-4 py-2">
        <Link href={"/"}>
          <div className="inline-flex text-3xl font-bold text-primary">
            Home
          </div>
        </Link>
      </div>
      <div className="h-4" />
      {navigation.map((section) => (
        <ul key={section.name} className="menu menu-compact px-4">
          <li className="menu-title">
            <span>{section.name}</span>
          </li>
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
      className={clsx({
        active: isActive,
      })}
    >
      {item.name}
    </Link>
  );
}
