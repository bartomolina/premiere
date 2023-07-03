import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex justify-between gap-2 pt-16">
      <div className="max-w-lg space-y-12">
        <p className="text-6xl font-semibold">
          Subscribe to your favorite creators in the
          <span className="text-green-500"> Lens </span>ecosystem
        </p>
        <div className="space-y-4">
          <p className="text-2xl font-light">
            Get exclusive news and promotions before anyone else
          </p>
          <Link href={"/profile/letsr44ve"} className="btn-primary btn">
            Start exploring
          </Link>
        </div>
      </div>
      <div className="flex items-center">
        <Image
          src={"/screenshot.png"}
          alt="Premiere"
          width={450}
          height={200}
          className="rounded-lg border shadow"
        />
      </div>
    </div>
  );
}
