import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <div className="flex gap-1 text-2xl">
        ⬛️
        <div>
          <span className="font-bold text-primary">App</span>
          <span className="font-normal text-base-content">Boilerplate</span>
        </div>
      </div>
    </Link>
  );
}
