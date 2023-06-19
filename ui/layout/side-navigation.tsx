import { navigation } from "@/lib/navigation";

import { Logo } from "./logo";
import { NavItem } from "./nav-item";

export function SideNav() {
  return (
    <aside className="h-full w-72 bg-base-200">
      <div className="flex h-20 items-center px-6">
        <Logo />
      </div>
      {navigation.map((section) => (
        <ul key={section.name} className="menu px-0">
          <li className="menu-title">{section.name}</li>
          {section.items.map((item) => (
            <li key={item.name}>
              <NavItem side={true} key={item.slug} item={item} />
            </li>
          ))}
        </ul>
      ))}
    </aside>
  );
}
