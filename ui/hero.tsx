import Image from "next/image";
import Link from "next/link";

import { LENS_NETWORK } from "@/lib/constants";

export function Hero() {
  return (
    <div className="grid grid-cols-1 gap-2 space-y-4 md:grid-cols-2">
      <div className="max-w-lg space-y-12">
        <p className="text-6xl font-semibold">
          Subscribe to your favorite creators in the
          <span className="text-green-500"> Lens </span>ecosystem
        </p>
        <div className="space-y-4">
          <p className="text-2xl font-light">
            Get exclusive news and promotions before anyone else
          </p>
          <Link
            href={
              LENS_NETWORK === "mainnet"
                ? "/profile/bartomolina"
                : "/profile/letsr44ve"
            }
            className="btn-primary btn"
          >
            Start exploring
          </Link>
        </div>
      </div>
      <div className="flex items-center justify-end">
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
