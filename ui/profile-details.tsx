import { type Profile } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { IStream } from "@superfluid-finance/sdk-core";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { LENSTER_URL } from "@/lib/constants";
import { getAvatar } from "@/lib/get-avatar";
import { getBaseProfileHandle, getProfileName } from "@/lib/get-profile-info";

import { SubscriptionActions } from "./subscription-actions";
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
    <div className="flex md:block md:space-y-3">
      <div>
        <div className="relative h-28 w-28 md:hidden">
          <Image
            src={getAvatar(profile)}
            alt={profile.handle}
            priority
            fill
            sizes="(max-width: 112px) 100vw"
            className="rounded-lg object-cover"
          />
        </div>
        <Image
          src={getAvatar(profile)}
          alt={profile.handle}
          width={200}
          height={200}
          priority
          className="hidden rounded-lg object-cover md:block"
        />
      </div>
      <div className="space-y-3 px-5 md:px-0">
        <SubscriptionActions
          tba={tba}
          profile={profile}
          subscriptions={subscriptions}
        />
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
        </div>
        <div className="prose mt-2 break-words text-xs">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {profile.bio ?? ""}
          </ReactMarkdown>
        </div>
        <TbaDetails
          profile={profile}
          tba={tba}
          tbaDeployed={tbaDeployed}
          tokenId={tokenId}
          accountCreated={accountCreated}
        />
      </div>
    </div>
  );
}
