import { useProfilesOwnedBy } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { type IStream } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";

import { SUPERFLUID_STREAM_URL } from "@/lib/constants";
import { getAvatar } from "@/lib/get-avatar";
import { getBaseProfileHandle, getProfileName } from "@/lib/get-profile-info";

export function Subscriber({ subscription }: { subscription: IStream }) {
  const { data: sender } = useProfilesOwnedBy({
    address: subscription.sender,
    limit: 1,
  });

  const flowRate =
    Number.parseFloat(ethers.utils.formatEther(subscription.currentFlowRate)) *
    60 *
    60 *
    24 *
    (365 / 12);

  if (!sender || sender.length === 0) {
    // eslint-disable-next-line unicorn/no-null
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/profile/${getBaseProfileHandle(sender[0])}`}>
        <Image
          src={getAvatar(sender[0])}
          alt={sender[0].handle}
          width={40}
          height={40}
          priority
          className="rounded-lg object-cover"
        />
      </Link>
      <div>
        <p className="font-semibold">
          <Link href={`/profile/${getBaseProfileHandle(sender[0])}`}>
            {getProfileName(sender[0])}
          </Link>
        </p>
        <p className="text-xs">
          <a
            className="flex items-center gap-1 text-gray-500 hover:underline"
            href={`${SUPERFLUID_STREAM_URL}${subscription.id}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {flowRate.toFixed(2)} DAI / mo.
            <ArrowSquareOut />
          </a>
        </p>
      </div>
    </div>
  );
}
