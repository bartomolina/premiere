import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <Image
        src={"/logo.svg"}
        alt="m0saic"
        className="hidden md:block"
        priority
        width={200}
        height={200}
      />
      <Image
        src={"/logo_small.png"}
        alt="m0saic"
        className="md:hidden sm:block hidden"
        priority
        width={75}
        height={75}
      />
    </Link>
  );
}
