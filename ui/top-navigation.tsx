import { Bars3Icon } from "@heroicons/react/24/solid";
import Link from "next/link";
import Image from "next/image";

export function TopNavigation() {
  return (
    <div
      className="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur 
  transition-all duration-100"
    >
      <nav className="navbar w-full">
        <div className="flex flex-1 md:gap-1 lg:gap-2">
          <label
            htmlFor="drawer"
            className="btn-ghost drawer-button btn-square btn lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </label>
          Top nav
        </div>
        <div>
          <a
            href="https://www.github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost drawer-button btn-square btn"
          >
            <Image src={"/github.svg"} alt="GitHub" width={20} height={20} />
          </a>
        </div>
      </nav>
    </div>
  );
}
