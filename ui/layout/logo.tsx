import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href={"/"}>
      <div>
        <Image
          src={"/logo.svg"}
          alt="m0saic"
          priority
          width={200}
          height={200}
        />
      </div>
    </Link>
  );
}
