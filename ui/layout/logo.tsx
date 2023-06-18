import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <div className="flex text-2xl gap-1">
        ⬛️
        <div>
          <span className="font-bold text-primary">App</span>
          <span className="font-normal text-base-content">Boilerplate</span>
        </div>
      </div>
    </Link>
  );
}
