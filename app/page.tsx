import SideNav from "@/ui/side-navigation";

export default function Home() {
  return (
    <div className="drawer-mobile drawer bg-base-100">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div
          className="sticky top-0 z-30 flex h-16 w-full justify-center bg-base-100 bg-opacity-90 text-base-content backdrop-blur 
  transition-all duration-100"
        >
          <nav className="navbar w-full">
            Navigation
          </nav>
        </div>
        <div className="px-6 pb-16 xl:pr-2">Content</div>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay" />
        <SideNav />
      </div>
    </div>
  );
}
