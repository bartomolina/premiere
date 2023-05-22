import Link from "next/link";

const SideNav = () => {
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
      <ul className="menu px-2">
        <li className="menu-title">
          <span>Actions</span>
        </li>
        <li>
          <Link href={"/"}>One</Link>
        </li>
        <li>
          <Link href={"/"}>Two</Link>
        </li>
      </ul>
    </aside>
  );
};

export default SideNav;
