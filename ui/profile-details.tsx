import { type Profile } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";
import Image from "next/image";

import { LENS_HUB_ADDRESS, LENSTER_URL, OPENSEA_URL } from "@/lib/constants";
import { getAvatar } from "@/lib/get-avatar";
import { getBaseProfileHandle, getProfileName } from "@/lib/get-profile-info";
import { Subscriptions } from "./subscriptions";
import { IStream } from "@superfluid-finance/sdk-core";
import { TbaDetails } from "./tba-details";

export function ProfileDetails({
  profile,
  tba,
  tbaDeployed,
  subscriptions,
  tokenId,
  accountCreated,
}: {
  profile: Profile;
  tba: `0x${string}`;
  tbaDeployed: boolean;
  subscriptions: IStream[];
  tokenId: string | undefined;
  accountCreated: () => void;
}) {
  return (
    <div className="space-y-3">
      <Image
        src={getAvatar(profile)}
        alt={profile.handle}
        width={200}
        height={200}
        priority
        className="rounded-lg object-cover"
      />
      <Subscriptions tba={tba} subscriptions={subscriptions} />
      <div>
        <div className="font-semibold text-primary">
          {getProfileName(profile)}
        </div>
        <div className="-mt-1">
          <a
            className="mt-1 flex items-center gap-1 text-gray-500 hover:underline"
            href={`${LENSTER_URL}u/${getBaseProfileHandle(profile)}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {profile.handle}
            <ArrowSquareOut />
          </a>
        </div>
        <a
          className="flex items-center gap-1 text-gray-500 hover:underline"
          href={`${OPENSEA_URL}${LENS_HUB_ADDRESS}/${Number.parseInt(
            profile.id,
            16
          )}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          View on OpenSea
          <ArrowSquareOut />
        </a>
      </div>
      <TbaDetails
        profile={profile}
        tba={tba}
        tbaDeployed={tbaDeployed}
        tokenId={tokenId}
        accountCreated={accountCreated}
      />
    </div>
  );
}
