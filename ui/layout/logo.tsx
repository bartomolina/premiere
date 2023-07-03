import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <Image
        src={"/premiere_logo.png"}
        alt="Premiere"
        className="hidden p-3 md:block"
        priority
        width={150}
        height={150}
      />
      <Image
        src={"/premiere_logo_small.png"}
        alt="Premiere"
        className="hidden sm:block md:hidden"
        priority
        width={75}
        height={75}
      />
    </Link>
  );
}
