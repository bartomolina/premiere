import { type Profile } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";

import { POLYGONSCAN_URL } from "@/lib/constants";
import { truncateAddr } from "@/lib/truncate-address";
import Image from "next/image";
import { CreateTba } from "./create-tba";

export function TbaDetails({
  profile,
  tba,
  tbaDeployed,
  tokenId,
  accountCreated,
}: {
  profile: Profile;
  tba: string;
  tbaDeployed: boolean;
  tokenId: string | undefined;
  accountCreated: () => void;
}) {
  return (
    <div className="pt-5 text-sm space-y-2">
      <div className="flex gap-2 items-center">
        <Image alt="Tokenbound" src={"/tb-mark.svg"} width={35} height={35} />
        <span className="font-semibold">ERC-6551 TBA</span>
      </div>
      <div>
        <label htmlFor="owner" className="font-semibold">
          Owner
        </label>
        <div id="owner" className="font-mono">
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
        <div id="tba" className="font-mono">
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
      <CreateTba
        tbaDeployed={tbaDeployed}
        tokenId={tokenId}
        accountCreated={accountCreated}
      />
    </div>
  );
}
