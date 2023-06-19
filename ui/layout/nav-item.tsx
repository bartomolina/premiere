import clsx from "clsx";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { twMerge } from "tailwind-merge";

import { NavItem } from "@/lib/navigation";

export function NavItem({
  item,
  side = false,
}: {
  item: NavItem;
  side?: boolean;
}) {
  const segment = useSelectedLayoutSegment();
  const isActive = item.slug === segment;

  return (
    <Link
      href={`/${item.slug}`}
      className={twMerge(
        "rounded-none",
        clsx({
          "hover:bg-transparent focus:bg-transparent px-0 py-2 border-transparent border-b-2 hover:border-base-200":
            !side,
          "font-semibold": isActive,
          " border-b-2 border-primary hover:border-primary": isActive && !side,
        })
      )}
    >
      {item.name}
      {isActive && side && (
        <span className="absolute inset-y-0 left-0 w-1 rounded-r-md bg-primary" />
      )}
    </Link>
  );
}
