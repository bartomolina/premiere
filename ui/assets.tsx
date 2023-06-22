import { type Profile } from "@lens-protocol/react-web";

import { AssetsNfts } from "./assets-nfts";
import { AssetsStreams } from "./assets-streams";
import { AssetsTokens } from "./assets-tokens";
import { Separator } from "./separator";

export function Assets({
  tba,
  profile,
}: {
  tba: `0x${string}`;
  profile: Profile;
}) {
  return (
    <div className="rounded-lg border border-base-200 p-4 shadow">
      <div>
        <Separator title="Streams" />
        <div className="py-5">
          <AssetsStreams tba={tba} profile={profile} />
        </div>
      </div>
      <div>
        <Separator title="NFTs" />
        <div className="py-5">
          <AssetsNfts tba={tba} />
        </div>
      </div>
      <div>
        <Separator title="Tokens" />
        <div className="py-5">
          <AssetsTokens tba={tba} />
        </div>
      </div>
    </div>
  );
}
