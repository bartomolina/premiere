import { type Profile } from "@lens-protocol/react-web";
import { ArrowSquareOut } from "@phosphor-icons/react";

import { POLYGONSCAN_URL } from "@/lib/constants";

export function TbaDetails({
  profile,
  tba,
  tbaDeployed,
}: {
  profile: Profile;
  tba: string;
  tbaDeployed: boolean;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="owner" className="text-sm font-semibold">
          Owned by
        </label>
        <div id="owner" className="font-mono">
          <a
            className="mt-1 flex items-center gap-1 text-gray-500 hover:underline"
            href={`${POLYGONSCAN_URL}address/${profile.ownedBy}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {profile.ownedBy}
            <ArrowSquareOut />
          </a>
        </div>
      </div>
      <div>
        <label htmlFor="tba" className="text-sm font-semibold">
          Token Bound Account
        </label>
        <div id="tba" className="font-mono">
          <a
            className="mt-1 flex items-center gap-1 text-gray-500 hover:underline"
            href={`${POLYGONSCAN_URL}address/${tba}`}
            target="_blank"
            rel="noreferrer noopener"
          >
            {tba}
            <ArrowSquareOut />
          </a>
        </div>
      </div>
      <div>
        <label htmlFor="deployed" className="text-sm font-semibold">
          Deployed
        </label>
        <div id="deployed" className="font-mono">
          <p className="mt-1 text-gray-500">{tbaDeployed.toString()}</p>
        </div>
      </div>
    </div>
  );
}
