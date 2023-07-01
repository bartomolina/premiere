import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <div className="relative h-16 w-40 lg:w-48">
        <Image
          src={"/logo.svg"}
          alt="m0saic"
          fill
          priority
          sizes="(max-width: 200px) 100vw"
        />
      </div>
    </Link>
  );
}
