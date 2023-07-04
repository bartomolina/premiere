import { type Profile } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";
import Image from "next/image";
import { useTheme } from "next-themes";

import {
  DARK_THEME,
  LENS_HUB_ADDRESS,
  OPENSEA_URL,
  POLYGONSCAN_URL,
} from "@/lib/constants";
import { truncateAddr } from "@/lib/truncate-address";

import { CreateTba } from "./create-tba";

export function TbaDetails({
  profile,
  tba,
  tbaDeployed,
  tokenId,
  accountCreated,
}: {
  profile: Profile;
  tba: `0x${string}`;
  tbaDeployed: boolean;
  tokenId: string | undefined;
  accountCreated: () => void;
}) {
  const { theme } = useTheme();

  return (
    <div className="space-y-4 pt-5 text-sm">
      <div>
        <a
          href="https://tokenbound.org/"
          className="flex items-center gap-2"
          target="_blank"
          rel="noreferrer noopener"
        >
          <Image
            alt="Tokenbound"
            src={theme === DARK_THEME ? "/tb-mark-dark.svg" : "/tb-mark.svg"}
            width={30}
            height={30}
          />
          <span className="font-semibold">ERC-6551 TBA</span>
        </a>
      </div>
      <div className="space-y-2">
        <div>
          <label htmlFor="token" className="font-semibold">
            Token
          </label>
          <div id="token" className="w-fit font-mono">
            <a
              className="flex items-center gap-1 text-gray-500 hover:underline"
              href={`${OPENSEA_URL}${LENS_HUB_ADDRESS}/${Number.parseInt(
                profile.id,
                16
              )}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {`${Number.parseInt(profile.id, 16)} (${profile.id})`}
              <ArrowSquareOut />
            </a>
          </div>
        </div>
        <div>
          <label htmlFor="owner" className="font-semibold">
            Owner
          </label>
          <div id="owner" className="w-fit font-mono">
            <a
              className="flex items-center gap-1 text-gray-500 hover:underline"
              href={`${POLYGONSCAN_URL}address/${profile.ownedBy}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {truncateAddr(profile.ownedBy)}
              <ArrowSquareOut />
            </a>
          </div>
        </div>
        <div>
          <label htmlFor="tba" className="font-semibold">
            Token Bound Account
          </label>
          <div id="tba" className="w-fit font-mono">
            <a
              className="flex items-center gap-1 text-gray-500 hover:underline"
              href={`${POLYGONSCAN_URL}address/${tba}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {truncateAddr(tba)}
              <ArrowSquareOut />
            </a>
          </div>
        </div>
      </div>
      <CreateTba
        tbaDeployed={tbaDeployed}
        tba={tba}
        profile={profile}
        tokenId={tokenId}
        accountCreated={accountCreated}
      />
    </div>
  );
}
